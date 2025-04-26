import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest, { BaseAddress, DEVELOPMENT } from "@/core/api";
import { useDispatch, useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens, updateThumbnail } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isConnected: false,
  chatsList: [],
  messagesList: [], // Store messages per conversation btw 2 users
  activeChatUsername: null, // Track which chat is currently open
  messageTyping: null,
  messagesNext: null,
  newChats: 0,
};

// WebSocket instance (outside Redux)
let socket = null;

// ----------------------------------
//  Socket receive message handlers
// ----------------------------------

function responseChatsList(message, dispatch) {
  // console.log("✅ Received chatsList:", message.data);
  dispatch(chatsList(message.data));
}

function responseThumbnail(message, dispatch) {
  console.log("responseThumbnail: ", message);

  dispatch(updateThumbnail(message.data));
}

function responseMessagesList(message, dispatch) {
  dispatch(
    chatsSlice.actions.setMessagesList({
      messages: message.data.messages,
      messagesNext: message.data.next,
      overwrite: false,
    })
  );
}

function responseMessageSend(message, dispatch, getState) {
  const username = message.data.friend.username;
  const currentState = getState();

  // Update chat preview and move to top
  dispatch(
    chatsSlice.actions.updateChatPreview({
      username,
      preview: message.data.message.content,
      timestamp: message.data.message.created,
    })
  );

  // console.log("curent state: ", currentState);

  // Only add to messagesList if it's the active chat
  if (username === currentState.chats.activeChatUsername) {
    dispatch(
      chatsSlice.actions.pushMessage({
        message: message.data.message,
        // overwrite: false,
      })
    );

    // Reset pagination state for this chat
    dispatch(
      chatsSlice.actions.setMessagesNext({
        messagesNext: null,
      })
    );
  }
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

// WebSocket Thunk
export const initializeChatSocket = createAsyncThunk(
  "chats/connection",
  async (tokens, { dispatch, getState, rejectWithValue }) => {
    try {
      // utils.log("Connecting WebSocket with token:", tokens);

      const protocol = DEVELOPMENT ? "ws" : "wss";
      socket = new WebSocket(
        `${protocol}://${BaseAddress}/ws/chat/?tokens=${tokens.access}`
      );

      socket.onopen = () => {
        console.log("Chat Socket connected!");
        socket.send(JSON.stringify({ source: "FetchChatsList" }));
      };

      socket.onmessage = (event) => {
        // Convert data to javascript object
        const parsed = JSON.parse(event.data);

        // log the data received
        // utils.log("Received from server:", event.data);

        // this is an object/dict of key -> value of function to be called
        const responses = {
          thumbnail: responseThumbnail, // this 'thumbnail' key will call the responseThumbnail function
          chatsList: responseChatsList,
          messagesList: responseMessagesList,
          message_typing: (message) =>
            responseMessageTyping(message, dispatch, getState),
          message_send: (message) =>
            responseMessageSend(message, dispatch, getState),
        };

        const resp = responses[parsed.source];

        if (!resp) {
          utils.log("parsed.source: " + parsed.source + " not found");
        } else {
          resp(parsed, dispatch); // ✅ Pass dispatch manually
        }
      };

      socket.onerror = (error) => {
        console.log(" WebSocket Error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      // 🚀 Auto-reconnect after 5 seconds
      // setTimeout(() => {
      //   dispatch(initializeChatSocket(tokens));
      // }, 5000);

      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ChatSocketClose = () => (dispatch) => {
  if (socket) {
    socket.close();
    socket = null; // Clear the socket reference
    dispatch(setWebSocketDisconnected());
  }
};
// Fetch messages for a chat
export const messagesList =
  (connectionId, page = 0) =>
  (dispatch) => {
    console.log("reach.....", page);
    if (page === 0) {
      dispatch(
        chatsSlice.actions.setMessagesList({
          messages: [],
          messagesNext: null,
          overwrite: true,
        })
      );
    } else {
      dispatch(
        chatsSlice.actions.setMessagesNext({
          messagesNext: null,
        })
      );
    }
    socket.send(
      JSON.stringify({
        connectionId,
        page,
        source: "fetchMessagesList",
      })
    );
  };

// Send message
export const messageSend = ({ connectionId, content }) => {
  // console.log("message Send: ", { connectionId, content });

  const messageData = JSON.stringify({
    connectionId,
    content,
    source: "message_send",
  });

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(messageData);
  } else {
    throw new Error("WebSocket is not connected");
  }
};

// typing a message
export const messageTyping = (username) => {
  const messageData = JSON.stringify({
    username,
    source: "message_typing",
  });
  // console.log("typing: ", username);

  if (socket && socket.readyState === WebSocket.OPEN) {
    // console.log("typing: ", username);
    socket.send(messageData);
  } else {
    throw new Error("WebSocket is not connected");
  }
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
      state.isConnected = true;
    },
    setWebSocketDisconnected(state) {
      state.isConnected = false;
    },
    chatsList(state, action) {
      // console.log("✅ chatsList reducer triggered with:", action.payload);
      state.chatsList = action.payload;
    },
    setMessagesList(state, action) {
      const { messages, overwrite, messagesNext } = action.payload;

      state.messagesNext = messagesNext;
      if (overwrite) {
        state.messagesList = messages;
        state.messageTyping = null;
      } else {
        state.messagesList = [...messages, ...(state.messagesList || [])];
      }
    },
    pushMessage(state, action) {
      const { message } = action.payload;
      state.messagesList = [message, ...(state.messagesList || [])];
      state.messageTyping = null;
    },
    setActiveChat(state, action) {
      state.activeChatUsername = action.payload;
    },
    updateChatPreview(state, action) {
      const { username, preview, timestamp } = action.payload;

      // Find and update the chat in chatsList
      const updatedChatsList = state.chatsList.map((chat) => {
        if (chat.friend.username === username) {
          return {
            ...chat,
            preview,
            updated: timestamp,
          };
        }
        return chat;
      });

      // Move the updated chat to the top
      const chatIndex = updatedChatsList.findIndex(
        (chat) => chat.friend.username === username
      );

      if (chatIndex >= 0) {
        const chat = updatedChatsList[chatIndex];
        updatedChatsList.splice(chatIndex, 1);
        updatedChatsList.unshift(chat);
      }

      state.chatsList = updatedChatsList;
    },
    setMessageTyping(state, action) {
      const username = action.payload.username;
      // console.log(action.payload);

      if (username !== state.activeChatUsername) return;
      // state.messageTyping = new Date();
      state.messageTyping = new Date().toString();
      console.log(state.messagesNext);
    },
    setMessagesNext(state, action) {
      state.messagesNext = action.payload.messagesNext;
    },
  },
});

export const {
  setWebSocketConnected,
  setWebSocketDisconnected,
  chatsList,
  setMessagesList,
  pushMessage,
  setActiveChat,
  updateChatPreview,
  setMessageTyping,
} = chatsSlice.actions;

export const getChatsList = (state) => state.chats.chatsList;
export const getMessages = (state) => state.chats.messagesList;
export const checkMessageTyping = (state) => state.chats.messageTyping;
export const getNextPage = (state) => state.chats.messagesNext;
export const getNewChats = (state) => state.chats.newChats;

export default chatsSlice.reducer;
