import apiRequest from "@/core/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: {},
  tokens: "",
  authenticated: false,
  error: null,
  status: null,
};

// Async thunk for login
export const logInUser = createAsyncThunk(
  "user/logInUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiRequest("users/auth/login/", data, "POST");
      console.log("Request Response: ", response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for signup
export const SignUpUser = createAsyncThunk(
  "user/SignUpUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiRequest("users/auth/register/", data, "POST");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOutUser(state) {
      state.user = {};
      state.tokens = "";
      state.authenticated = false;
      state.error = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens; // Ensure correct property
        state.authenticated = true;
        state.status = "fulfilled";
        state.error = null;
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(SignUpUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(SignUpUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens; // Ensure correct property
        state.authenticated = true;
        state.status = "fulfilled";
        state.error = null;
      })
      .addCase(SignUpUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export const getAuthentication = (state) => state.user.authenticated;
export const getUserInfo = (state) => state.user;
export const getTokens = (state) => state.user.tokens;

// Exporting actions
export const { logOutUser } = userSlice.actions;

// Exporting reducer
export default userSlice.reducer;
