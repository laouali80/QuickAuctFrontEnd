import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest, { BaseAddress } from "@/core/api";
import { useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens } from "./userSlice";

const initialState = {
  isConnected: false,
};

// Async Thunk: Websocket connection
export const websocketConnection = createAsyncThunk(
  "chats/connection",
  async (tokens, { rejectWithValue }) => {
    try {
      const socket = new WebSocket(
        `ws//${BaseAddress}/chat/?tokens=${tokens.access}`
      );

      socket.onopen = () => {
        utils.log("socket.onopen");
      };

      socket.onmessage = () => {
        utils.log("socket.onmessage");
      };

      socket.onerror = () => {
        utils.log("socket.onerror");
      };

      socket.onoclose = () => {
        utils.log("socket.onoclose");
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Chats Slice
const chatsClice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    socketClose(state) {
      state.isConnected = false;
    },
    extraReducers: (builder) => {
      builder.addCase(websocketConnection.fulfilled, (state, action) => {
        state.isConnected = true;
      });
    },
  },
});

// Selectors
// export const getSocketConnection = (state) => state.user.authenticated;
// export const getInitialized = (state) => state.user.initialized;
// export const getUserInfo = (state) => state.user;
// export const getTokens = (state) => state.user.tokens;

// Export Actions & Reducer
export const { socketConnect, socketClose } = chatsClice.actions;
export default chatsClice.reducer;
