import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "@/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens, updateThumbnail } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseAddress, DEVELOPMENT, SocketProtocol } from "@/constants/config";
import { sendChatDataThroughSocket } from "@/core/chatSocketManager";

const initialState = {
  isConnected: false,

  // Chat conversations - organized by connectionId
  // conversations: {
  //   // Each key is a connectionId (unique for each conversation)
  //   [connectionId]: {
  //     connectionId: "...",
  //     friend: { userId: "...", ... },   // sender user object
  //     receiver: { userId: "...", ... }, // receiver user object
  //     chats: {
  //       messages: [
  //         { id, is_me, content, created, auction, ... },
  //         // ...
  //       ],
  //       pagination: {
  //         hasNext: true,
  //         nextPage: 2,
  //         loaded: true,
  //       }
  //     },
  //     last_message_content: "...",
  //     last_updated: "...",
  //     lastRead: timestamp,
  //     unreadCount: 0,
  //     typing: { username: null, timestamp: null }
  //   },
  //   // ...more connectionIds

  //   // Pagination for the list of connections (not messages)
  //   pagination: {
  //     hasNext: true,
  //     nextPage: 2,
  //     loaded: true,
  //   }
  // },

  conversations: {},

  // Active chat tracking
  activeChatId: null,

  chatsList: [],
  messagesList: [], // Store messages per conversation btw 2 users
  activeChatUsername: null, // Track which chat is currently open
  // messageTyping: null,
  messagesNext: null,
  newChats: 0,
};

// WebSocket instance (outside Redux)
let socket = null;

const addMessageToConversationUtil = (conversation, message, isNew = false) => {
  // Prevent duplicates
  const existingIndex = conversation.chats.messages.findIndex(
    (m) => m.id === message.id
  );

  // if (existingIndex !== -1) {
  //   // Update existing message (for status updates)
  //   conversation.messages[existingIndex] = {
  //     ...conversation.messages[existingIndex],
  //     ...message,
  //   };
  //   return conversation;
  // }

  // Add new message
  const updatedMessages = isNew
    ? [message, ...conversation.chats.messages]
    : [...conversation.chats.messages, message];

  return {
    ...conversation,
    chats: {
      messages: updatedMessages,
      pagination: conversation.chats.pagination,
    },
    typing: { username: null, timestamp: null },
    last_message_content: message.content,
    last_updated: new Date().toISOString(),
    unreadCount: isNew
      ? conversation.unreadCount + 1
      : conversation.unreadCount,
  };
};

// ----------------------------------
//  Socket receive message handlers
// ----------------------------------

function responseThumbnail(message, dispatch) {
  console.log("responseThumbnail: ", message);

  dispatch(updateThumbnail(message.data));
}

function responseMessageTyping(message, dispatch, getState) {
  const currentState = getState();

  // Only show typing indicator if it's for the active chat
  if (message.data.username === currentState.chats.activeChatUsername) {
    dispatch(
      chatsSlice.actions.setMessageTyping({
        username: message.data.username,
      })
    );
  }
}

// export const ChatSocketClose = () => (dispatch) => {
//   if (socket) {
//     socket.close();
//     socket = null; // Clear the socket reference
//     dispatch(setWebSocketDisconnected());
//   }
// };
// Fetch messages for a chat
export const fetchChats = (data) => (dispatch) => {
  // console.log("reach.....", data);

  if (data.page === 1) {
    dispatch(
      chatsSlice.actions.clearChats({
        connectionId: data.connectionId,
      })
    );
  }

  // if (page === 0) {
  //   dispatch(
  //     chatsSlice.actions.setChatMessages({
  //       messages: [],
  //       messagesNext: null,
  //       overwrite: true,
  //     })
  //   );
  // }
  sendChatDataThroughSocket({
    data,
    source: "fetchChatMessages",
  });
};

// Send message
export const messageSend = (data) => {
  // console.log("message Send: ", data);

  sendChatDataThroughSocket({
    data,
    source: "message_send",
  });
};

// typing a message
// export const messageTyping = (username) => {
//   const messageData = JSON.stringify({
//     username,
//     source: "message_typing",
//   });
//   // console.log("typing: ", username);

//   if (socket && socket.readyState === WebSocket.OPEN) {
//     // console.log("typing: ", username);
//     socket.send(messageData);
//   } else {
//     throw new Error("WebSocket is not connected");
//   }
// };

export const sendTypingIndicator = (data) => {
  // console.log("typing: ", data);

  sendChatDataThroughSocket({
    data,
    source: "message_typing",
  });
};

// export const chatsList =
export const uploadThumbnail = (file) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log(file);
    socket.send(
      JSON.stringify({
        source: "thumbnail",
        base64: file.uri,
        filename: file.fileName,
      })
    );
  } else {
    throw new Error("WebSocket is not connected");
  }
};

// Chats Slice
const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setWebSocketConnected(state) {
      // console.log("WebSocket Connected");
      state.isConnected = true;
    },
    setWebSocketDisconnected(state) {
      state.isConnected = false;
    },
    setConversations(state, action) {
      // console.log("✅ chatsList reducer triggered with:", action.payload);
      const { data, pagination } = action.payload;

      // Convert new conversations to objects with
      const newConversations = {};
      data.forEach((conversation) => {
        newConversations[conversation.connectionId] = {
          ...conversation,
          lastRead: null,
          unreadCount: 5,
          chats: { messages: [], pagination: {} },
          typing: { username: null, timestamp: null },
        };
      });

      // console.log("seting newConversations: ",newConversations);

      // Merge with existing conversations based on loaded flag
      if (pagination.loaded) {
        // Append new conversations to existing ones (for pagination)
        // New conversations will override existing ones if they have the same ID
        state.conversations = {
          ...state.conversations,
          ...newConversations,
          pagination: pagination,
        };
      } else {
        // Prepend new conversations to existing ones (for refresh/new data)
        // Existing conversations will override new ones if they have the same ID
        state.conversations = {
          ...newConversations,
          ...state.conversations,
          pagination: pagination,
        };
      }
    },
    setChatMessages(state, action) {
      const { connectionId, messages, pagination, friend } = action.payload;

      // console.log('messages: ',messages);

      if (!state.conversations[connectionId]) {
        state.conversations[connectionId] = {
          connectionId,
          friend: friend || {},
          chats: { messages: [], pagination: {} },
          last_message_content: "",
          last_updated: null,
          lastRead: null,
          unreadCount: 0,
          typing: { username: null, timestamp: null },
        };
      }

      const existingMessages = state.conversations[connectionId].chats.messages;

      // Create a map of existing message IDs for fast lookup
      const existingIds = new Set(existingMessages.map((msg) => msg.id));

      // Filter out duplicates
      const newMessages = messages.filter((msg) => !existingIds.has(msg.id));

      if (pagination.loaded) {
        // Loading older messages (pagination)
        state.conversations[connectionId].chats.messages = [
          ...existingMessages,
          ...newMessages,
        ];
      } else {
        // First page load / refresh
        state.conversations[connectionId].chats.messages = [
          ...newMessages,
          ...existingMessages,
        ];
      }

      // Update pagination info
      state.conversations[connectionId].chats.pagination = pagination;
    },
    pushMessage(state, action) {
      const { message } = action.payload;
      state.messagesList = [message, ...(state.messagesList || [])];
      state.messageTyping = null;
    },
    // setActiveChat(state, action) {
    //   state.activeChatUsername = action.payload;
    // },

    setActiveChat(state, action) {
      state.activeChatId = action.payload;
      // Mark messages as read when opening chat
      if (action.payload && state.conversations[action.payload]) {
        state.conversations[action.payload].lastRead = new Date().toISOString();
        state.conversations[action.payload].unreadCount = 0;
      }
    },

    addMessageToConversation(state, action) {
      const { connectionId, message, isNew } = action.payload;

      // if (!state.conversations[connectionId]) {
      //   state.conversations[connectionId] = createConversation(connectionId);
      // }

      const updatedConversation = addMessageToConversationUtil(
        state.conversations[connectionId],
        message,
        isNew
      );
      // Remove the old entry and re-insert at the top
      const { [connectionId]: removed, ...rest } = state.conversations;
      state.conversations = {
        [connectionId]: updatedConversation,
        ...rest,
      };
    },

    setTypingIndicator(state, action) {
      const { connectionId, username, timestamp } = action.payload;

      if (!state.conversations[connectionId]) {
        state.conversations[connectionId] = createConversation(connectionId);
      }

      state.conversations[connectionId].typing = { username, timestamp };
    },

    setMessagesNext(state, action) {
      state.messagesNext = action.payload.messagesNext;
    },
    clearChats(state, action) {
      const connectionId = action.payload;

      if (!state.conversations[connectionId]) {
        console.warn(
          `connection id '${connectionId}' not found in state.conversations`
        );
        return;
      }

      state.conversations[connectionId]["chats"] = {};
    },
  },
});

export const {
  setWebSocketConnected,
  setWebSocketDisconnected,
  chatsList,
  setChatMessages,
  pushMessage,
  setActiveChat,
  updateChatPreview,
  setMessageTyping,
} = chatsSlice.actions;

export const getConversationsList = (state) =>
  Object.values(state.chats.conversations).filter(
    (convo) => convo && convo.connectionId
  );

export const findConnectionBySeller = (sellerId) => (state) => {
  const conn = Object.values(state.chats.conversations).find(
    (conn) =>
      conn &&
      conn.connectionId &&
      conn.friend &&
      conn.friend.userId === sellerId
  );
  return conn ? conn : null;
};

// export const findConnectionBySeller = (sellerId) => (state) => {
//   const conns = Object.values(state.chats.conversations).filter(
//     convo => convo && convo.connectionId
//   );
//   // If you have sender/receiver:
//   const conn = conns.find(
//     conn =>
//       (conn.sender && conn.sender.userId === sellerId) ||
//       (conn.receiver && conn.receiver.userId === sellerId) ||
//       (conn.friend && conn.friend.userId === sellerId) // fallback for old model
//   );
//   return conn ? conn.connectionId : null;
// };
export const getChatMessages = (connectionId) => (state) => {
  const conn = state.chats.conversations[connectionId];
  return conn && conn.chats && Array.isArray(conn.chats.messages)
    ? conn.chats.messages
    : [];
};

export const getMessages = (state) => state.chats.messagesList;
// export const checkMessageTyping = (connectionId)=>(state) => state.chats.messageTyping;
export const checkMessageTyping = (connectionId) => (state) =>
  state.chats.conversations[connectionId]?.typing?.timestamp || null;
export const getNextPage = (state) => state.chats.messagesNext;
export const getNewChats = (state) => state.chats.newChats;

export default chatsSlice.reducer;
