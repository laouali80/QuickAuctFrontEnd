import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest, { BaseAddress } from "@/core/api";
import { useDispatch, useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens, updateThumbnail } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isConnected: false,
  messages: {}, // Store messages per conversation
};

// WebSocket instance (outside Redux)
let socket = null;

// ----------------------------------
//  Socket receive message handlers
// ----------------------------------

function responseThumbnail(data) {
  const dispatch = useDispatch(); // Get dispatch function

  dispatch(updateThumbnail(data));
}

// WebSocket Thunk
export const websocketConnection = createAsyncThunk(
  "chats/connection",
  async (tokens, { dispatch, rejectWithValue }) => {
    try {
      utils.log("Connecting WebSocket with token:", tokens);

      // const protocol = BaseAddress.startsWith("https") ? "wss" : "ws";
      socket = new WebSocket(
        `ws://${BaseAddress}/ws/chat/?tokens=${tokens.access}`
      );

      // socket.onopen = () => {
      //   utils.log("WebSocket connected");
      //   dispatch(setWebSocketConnected());
      // };

      // let socket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

      socket.onopen = () => {
        console.log("WebSocket connected!");
        // socket.send(JSON.stringify({ message: "Hello WebSocket!" }));
      };

      socket.onmessage = (event) => {
        // Convert data to javascript object
        const parsed = JSON.parse(event.data);

        // log the data received
        utils.log("Received from server:", event.data);

        // this is an object/dict of key -> value of function to be called
        const responses = {
          thumbnail: responseThumbnail, // this 'thumbnail' key will call the responseThumbnail function
        };

        const resp = responses[parsed.source];

        if (!resp) {
          utils.log("parsed.source: " + parsed.source + " not found");
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
      //   dispatch(websocketConnection(tokens));
      // }, 5000);

      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const socketClose = () => {
  const socket = get().socket;

  if (socket) {
    socket.close();
  }

  dispatch(setWebSocketDisconnected());
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
  receiveMessage,
} = chatsSlice.actions;
export default chatsSlice.reducer;
