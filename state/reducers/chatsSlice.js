import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest, { BaseAddress } from "@/core/api";
import { useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isConnected: false,
};

// WebSocket Thunk
export const websocketConnection = createAsyncThunk(
  "chats/connection",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const storedTokens = await AsyncStorage.getItem("persist:root"); // Get persisted state
      const parsedTokens = storedTokens
        ? JSON.parse(storedTokens).tokens
        : null;

      if (!parsedTokens || !parsedTokens.access) {
        throw new Error("No access token found");
      }

      utils.log("Connecting WebSocket with token:", parsedTokens.access);
      const socket = new WebSocket(
        `ws://${BaseAddress}/chat/?tokens=${tokens.access}`
      );

      socket.onopen = () => {
        utils.log("WebSocket connected");
        dispatch(setWebSocket(socket)); // Store in Redux
      };

      socket.onmessage = (event) => {
        utils.log("Received message:", event.data);
      };

      socket.onerror = (error) => {
        utils.log("WebSocket error:", error);
      };

      socket.onclose = () => {
        utils.log("WebSocket closed");
        dispatch(clearWebSocket()); // Remove socket from Redux
      };

      return socket;
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
    setWebSocket(state, action) {
      state.socket = action.payload;
      state.isConnected = true;
    },
    clearWebSocket(state) {
      if (state.socket) {
        state.socket.close();
      }
      state.socket = null;
      state.isConnected = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(websocketConnection.fulfilled, (state, action) => {
      state.socket = action.payload;
      state.isConnected = true;
    });
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
