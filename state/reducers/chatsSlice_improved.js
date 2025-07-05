import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseAddress, DEVELOPMENT } from "@/constants/config";

// Improved initial state structure
const initialState = {
  // Connection state
  isConnected: false,
  connectionError: null,
  
  // Chat conversations - organized by connectionId
  conversations: {
    // connectionId: {
    //   messages: [],
    //   pagination: { next: null, hasMore: true },
    //   lastRead: timestamp,
    //   unreadCount: 0,
    //   typing: { username: null, timestamp: null }
    // }
  },
  
  // Chat list for navigation
  chatsList: [],
  
  // Active chat tracking
  activeChatId: null,
  
  // Offline message queue
  offlineQueue: [],
  
  // Message delivery status
  messageStatus: {
    // messageId: { status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed' }
  },
  
  // Search and filters
  searchQuery: '',
  filters: {
    unreadOnly: false,
    dateRange: null
  }
};

// WebSocket instance (outside Redux)
let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Utility functions
const createConversation = (connectionId) => ({
  messages: [],
  pagination: { next: null, hasMore: true },
  lastRead: null,
  unreadCount: 0,
  typing: { username: null, timestamp: null }
});

const addMessageToConversationUtil = (conversation, message, isNew = false) => {
  // Prevent duplicates
  const existingIndex = conversation.messages.findIndex(m => m.id === message.id);
  if (existingIndex !== -1) {
    // Update existing message (for status updates)
    conversation.messages[existingIndex] = { ...conversation.messages[existingIndex], ...message };
    return conversation;
  }
  
  // Add new message
  const updatedMessages = isNew 
    ? [message, ...conversation.messages]
    : [...conversation.messages, message];
    
  return {
    ...conversation,
    messages: updatedMessages.slice(0, 1000), // Limit to 1000 messages per conversation
    unreadCount: isNew ? conversation.unreadCount + 1 : conversation.unreadCount
  };
};

// WebSocket message handlers
const handleChatsList = (message, dispatch) => {
  dispatch(chatsSlice.actions.setChatsList(message.data));
};

const handleMessagesList = (message, dispatch, getState) => {
  const { connectionId, messages, next, hasMore } = message.data;
  const state = getState();
  
  dispatch(chatsSlice.actions.updateConversationMessages({
    connectionId,
    messages,
    pagination: { next, hasMore },
    overwrite: true
  }));
};

const handleMessageSend = (message, dispatch, getState) => {
  const { connectionId, message: newMessage } = message.data;
  const state = getState();
  
  // Update conversation
  dispatch(chatsSlice.actions.addMessageToConversation({
    connectionId,
    message: newMessage,
    isNew: true
  }));
  
  // Update chat preview
  dispatch(chatsSlice.actions.updateChatPreview({
    connectionId,
    preview: newMessage.content,
    timestamp: newMessage.created
  }));
  
  // Update message status
  dispatch(chatsSlice.actions.updateMessageStatus({
    messageId: newMessage.id,
    status: 'delivered'
  }));
};

const handleMessageTyping = (message, dispatch, getState) => {
  const { connectionId, username } = message.data;
  const state = getState();
  
  // Only show typing for active chat
  if (connectionId === state.chats.activeChatId) {
    dispatch(chatsSlice.actions.setTypingIndicator({
      connectionId,
      username,
      timestamp: Date.now()
    }));
  }
};

// WebSocket Thunk with improved error handling and reconnection
export const initializeChatSocket = createAsyncThunk(
  "chats/initializeSocket",
  async (tokens, { dispatch, getState, rejectWithValue }) => {
    try {
      const protocol = DEVELOPMENT ? "ws" : "wss";
      socket = new WebSocket(`${protocol}://${BaseAddress}/ws/chat/?tokens=${tokens.access}`);
      
      return new Promise((resolve, reject) => {
        socket.onopen = () => {
          console.log("Chat Socket connected!");
          reconnectAttempts = 0;
          dispatch(chatsSlice.actions.setConnectionStatus({ isConnected: true, error: null }));
          socket.send(JSON.stringify({ source: "FetchChatsList" }));
          resolve(true);
        };
        
        socket.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            const handlers = {
              chatsList: handleChatsList,
              messagesList: handleMessagesList,
              message_send: handleMessageSend,
              message_typing: handleMessageTyping
            };
            
            const handler = handlers[parsed.source];
            if (handler) {
              handler(parsed, dispatch, getState);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };
        
        socket.onerror = (error) => {
          console.error("WebSocket Error:", error);
          dispatch(chatsSlice.actions.setConnectionStatus({ 
            isConnected: false, 
            error: error.message 
          }));
          reject(error);
        };
        
        socket.onclose = () => {
          console.log("WebSocket Disconnected");
          dispatch(chatsSlice.actions.setConnectionStatus({ 
            isConnected: false, 
            error: null 
          }));
          
          // Auto-reconnect logic
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(() => {
              dispatch(initializeChatSocket(tokens));
            }, Math.pow(2, reconnectAttempts) * 1000); // Exponential backoff
          }
        };
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Improved action creators
export const loadMessages = (connectionId, page = 0) => (dispatch) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    // Queue for offline
    dispatch(chatsSlice.actions.addToOfflineQueue({
      type: 'loadMessages',
      payload: { connectionId, page }
    }));
    return;
  }
  
  socket.send(JSON.stringify({
    connectionId,
    page,
    source: "fetchMessagesList"
  }));
};

export const sendMessage = ({ connectionId, content }) => (dispatch, getState) => {
  const messageId = Date.now().toString(); // Temporary ID
  const message = {
    id: messageId,
    content,
    created: new Date().toISOString(),
    is_me: true,
    status: 'sending'
  };
  
  // Optimistically add message
  dispatch(chatsSlice.actions.addMessageToConversation({
    connectionId,
    message,
    isNew: true
  }));
  
  // Update message status
  dispatch(chatsSlice.actions.updateMessageStatus({
    messageId,
    status: 'sending'
  }));
  
  // Send via WebSocket
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      connectionId,
      content,
      source: "message_send"
    }));
  } else {
    // Queue for offline
    dispatch(chatsSlice.actions.addToOfflineQueue({
      type: 'sendMessage',
      payload: { connectionId, content, messageId }
    }));
  }
};

export const sendTypingIndicator = (connectionId) => (dispatch) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      connectionId,
      source: "message_typing"
    }));
  }
};

// Improved slice with better state management
const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setConnectionStatus(state, action) {
      const { isConnected, error } = action.payload;
      state.isConnected = isConnected;
      state.connectionError = error;
    },
    
    setChatsList(state, action) {
      state.chatsList = action.payload;
    },
    
    setActiveChat(state, action) {
      state.activeChatId = action.payload;
      // Mark messages as read when opening chat
      if (action.payload && state.conversations[action.payload]) {
        state.conversations[action.payload].lastRead = Date.now();
        state.conversations[action.payload].unreadCount = 0;
      }
    },
    
    updateConversationMessages(state, action) {
      const { connectionId, messages, pagination, overwrite } = action.payload;
      
      if (!state.conversations[connectionId]) {
        state.conversations[connectionId] = createConversation(connectionId);
      }
      
      if (overwrite) {
        state.conversations[connectionId].messages = messages;
      } else {
        state.conversations[connectionId].messages = [
          ...messages,
          ...state.conversations[connectionId].messages
        ];
      }
      
      state.conversations[connectionId].pagination = pagination;
    },
    
    addMessageToConversation(state, action) {
      const { connectionId, message, isNew } = action.payload;
      
      if (!state.conversations[connectionId]) {
        state.conversations[connectionId] = createConversation(connectionId);
      }
      
      const updatedConversation = addMessageToConversationUtil(
        state.conversations[connectionId],
        message,
        isNew
      );
      
      state.conversations[connectionId] = updatedConversation;
    },
    
    updateChatPreview(state, action) {
      const { connectionId, preview, timestamp } = action.payload;
      
      // Update in chatsList
      const chatIndex = state.chatsList.findIndex(
        chat => chat.connectionId === connectionId
      );
      
      if (chatIndex !== -1) {
        state.chatsList[chatIndex] = {
          ...state.chatsList[chatIndex],
          preview,
          updated: timestamp
        };
        
        // Move to top
        const chat = state.chatsList[chatIndex];
        state.chatsList.splice(chatIndex, 1);
        state.chatsList.unshift(chat);
      }
    },
    
    setTypingIndicator(state, action) {
      const { connectionId, username, timestamp } = action.payload;
      
      if (!state.conversations[connectionId]) {
        state.conversations[connectionId] = createConversation(connectionId);
      }
      
      state.conversations[connectionId].typing = { username, timestamp };
    },
    
    updateMessageStatus(state, action) {
      const { messageId, status } = action.payload;
      state.messageStatus[messageId] = status;
    },
    
    addToOfflineQueue(state, action) {
      state.offlineQueue.push(action.payload);
    },
    
    clearOfflineQueue(state) {
      state.offlineQueue = [];
    },
    
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    }
  }
});

// Selectors with memoization
export const selectIsConnected = (state) => state.chats.isConnected;
export const selectConnectionError = (state) => state.chats.connectionError;
export const selectChatsList = (state) => state.chats.chatsList;
export const selectActiveChatId = (state) => state.chats.activeChatId;
export const selectActiveChat = (state) => {
  const activeId = state.chats.activeChatId;
  return activeId ? state.chats.conversations[activeId] : null;
};
export const selectConversation = (connectionId) => (state) => 
  state.chats.conversations[connectionId] || createConversation(connectionId);
export const selectUnreadCount = (state) => 
  Object.values(state.chats.conversations).reduce((total, conv) => total + conv.unreadCount, 0);
export const selectOfflineQueue = (state) => state.chats.offlineQueue;

export const {
  setConnectionStatus,
  setChatsList,
  setActiveChat,
  updateConversationMessages,
  addMessageToConversation,
  updateChatPreview,
  setTypingIndicator,
  updateMessageStatus,
  addToOfflineQueue,
  clearOfflineQueue,
  setSearchQuery,
  setFilters
} = chatsSlice.actions;

export default chatsSlice.reducer; 