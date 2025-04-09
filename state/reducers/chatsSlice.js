import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest, { BaseAddress } from "@/core/api";
import { useDispatch, useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens, updateThumbnail } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isConnected: false,
  messages: {}, // Store messages per conversation
  chatsList: [],
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
  dispatch(updateThumbnail(message));
}

// WebSocket Thunk
export const initializeChatSocket = createAsyncThunk(
  "chats/connection",
  async (tokens, { dispatch, rejectWithValue }) => {
    try {
      utils.log("Connecting WebSocket with token:", tokens);

      // const protocol = BaseAddress.startsWith("https") ? "wss" : "ws";
      socket = new WebSocket(
        `ws://${BaseAddress}/ws/chat/?tokens=${tokens.access}`
      );

      socket.onopen = () => {
        console.log("Chat Socket connected!");
        socket.send(JSON.stringify({ source: "FetchChatsList" }));
      };

      socket.onmessage = (event) => {
        // Convert data to javascript object
        const parsed = JSON.parse(event.data);

        // log the data received
        utils.log("Received from server:", event.data);

        // this is an object/dict of key -> value of function to be called
        const responses = {
          thumbnail: responseThumbnail, // this 'thumbnail' key will call the responseThumbnail function
          chatsList: responseChatsList,
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
export const messageList = createAsyncThunk(
  "chats/messageList",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BaseAddress}/api/chats/${chatId}/messages/`
      );
      const data = await response.json();
      return { chatId, messages: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Send message
export const messageSend = createAsyncThunk(
  "chats/messageSend",
  async ({ chatId, content }, { dispatch, rejectWithValue }) => {
    try {
      const messageData = JSON.stringify({ chat_id: chatId, content });

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(messageData);
        dispatch(
          receiveMessage({
            chatId,
            message: { chat_id: chatId, content, sender: "me" },
          })
        );
      } else {
        throw new Error("WebSocket is not connected");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// export const chatsList =
export const uploadThumbnail = (file) => {
  const socket = get().socket;

  socket.send(
    JSON.stringify({
      source: "thumbnail",
      base64: file.base64,
      filename: file.fileName,
    })
  );
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
    receiveMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(messageList.fulfilled, (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    });
  },
});

export const {
  setWebSocketConnected,
  setWebSocketDisconnected,
  chatsList,
  receiveMessage,
} = chatsSlice.actions;

export const getChatsList = (state) => state.chats.chatsList;

export default chatsSlice.reducer;
