import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest, { BaseAddress } from "@/core/api";
import { useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";



const initialState = {
  isConnected: false,
  messages: {}, // Store messages per conversation
};

// WebSocket instance (outside Redux)
let socket = null;

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

      socket.onopen = () => {
        utils.log("WebSocket connected");
        dispatch(setWebSocketConnected());
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          dispatch(receiveMessage({ chatId: data.chat_id, message: data }));
        }
      };

      socket.onerror = (error) => {
        utils.log("WebSocket error:", error);
      };

      socket.onclose = () => {
        utils.log("WebSocket closed");
        dispatch(setWebSocketDisconnected());
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

// Fetch messages for a chat
export const messageList = createAsyncThunk(
  "chats/messageList",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BaseAddress}/api/chats/${chatId}/messages/`);
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
        dispatch(receiveMessage({ chatId, message: { chat_id: chatId, content, sender: "me" } }));
      } else {
        throw new Error("WebSocket is not connected");
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
    builder
      .addCase(messageList.fulfilled, (state, action) => {
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
      });
  },
});

export const { setWebSocketConnected, setWebSocketDisconnected, receiveMessage } = chatsSlice.actions;
export default chatsSlice.reducer;


// const initialState = {
//   isConnected: false,
// };

// // WebSocket Thunk
// export const websocketConnection = createAsyncThunk(
//   "chats/connection",
//   async (tokens, { dispatch, rejectWithValue }) => {
//     try {
    

//       utils.log("Connecting WebSocket with token:", tokens);
//       const socket = new WebSocket(
//         `ws://${BaseAddress}/chat/?tokens=${tokens.access}`
//       );

//       socket.onopen = () => {
//         utils.log("WebSocket connected");
//         dispatch(setWebSocket(socket)); // Store in Redux
//       };

//       socket.onmessage = (event) => {
//         utils.log("Received message:", event.data);
//       };

//       socket.onerror = (error) => {
//         utils.log("WebSocket error:", error);
//       };

//       socket.onclose = () => {
//         utils.log("WebSocket closed");
//         dispatch(clearWebSocket()); // Remove socket from Redux
//       };

//       return socket;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // Chats Slice
// const chatsClice = createSlice({
//   name: "chats",
//   initialState,
//   reducers: {
//     setWebSocket(state, action) {
//       state.socket = action.payload;
//       state.isConnected = true;
//     },
//     clearWebSocket(state) {
//       if (state.socket) {
//         state.socket.close();
//       }
//       state.socket = null;
//       state.isConnected = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(websocketConnection.fulfilled, (state, action) => {
//       state.socket = action.payload;
//       state.isConnected = true;
//     });
//   },
// });

// Selectors
// export const getSocketConnection = (state) => state.user.authenticated;
// export const getInitialized = (state) => state.user.initialized;
// export const getUserInfo = (state) => state.user;
// export const getTokens = (state) => state.user.tokens;

// Export Actions & Reducer
// export const { socketConnect, socketClose } = chatsClice.actions;
// export default chatsClice.reducer;
