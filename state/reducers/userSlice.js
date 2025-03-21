import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: {},
  tokens: "",
  authenticated: false,
  loginErr: null,
  status: null,
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    // Actions

    logOutUser(state, action) {
      (state.user = {}), (state.tokens = "");
      state.authenticated = false;
      state.loginErr = null;
      state.status = null;
    },

    extraReducers(builder) {
      builder
        .addCase(logInUser.pending, (state) => {
          state.status = "pending";
        })
        .addCase(logInUser.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.status = action.payload.status;
          state.token = action.payload.token;
          state.authenticated = true;
          state.loginErr = null; // Clear any previous error
        })
        .addCase(logInUser.rejected, (state, action) => {
          // console.log("here.....", action.payload);
          state.status = action.payload.status;
          state.loginErr = action.payload.err;
        });
    },
    extraReducers(builder) {
      builder
        .addCase(SignUpUser.pending, (state) => {
          state.status = "pending";
        })
        .addCase(SignUpUser.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.status = action.payload.status;
          state.token = action.payload.token;
          state.authenticated = true;
          state.loginErr = null; // Clear any previous error
        })
        .addCase(SignUpUser.rejected, (state, action) => {
          // console.log("here.....", action.payload);
          state.status = action.payload.status;
          state.loginErr = action.payload.err;
        });
    },
  },
});

export const logInUser = createAsyncThunk(
  "logInUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // const token = await axios.get(email, password);
      const token = await axios.get("http://localhost:8000/api/users/welcome/");
      console.log(response);
      // return {
      //   status: "fulfilled",
      //   token: token,
      // };
    } catch (err) {
      console.log(err.message);
      // return rejectWithValue({
      //   status: "rejected",
      //   err: err.message,
      // });
    }
  }
);

export const SignUpUser = createAsyncThunk(
  "logInUser",
  async (data, { rejectWithValue }) => {
    try {
      // const token = await axios.get(email, password);
      const token = await axios.get("http://localhost:8000/api/users/welcome/");
      console.log(response);
      // return {
      //   status: "fulfilled",
      //   token: token,
      // };
    } catch (err) {
      console.log(err.message);
      // return rejectWithValue({
      //   status: "rejected",
      //   err: err.message,
      // });
    }
  }
);

// exporting the actions
export const { logOutUser } = userSlice.actions;

// Exporting the reducer
export default userSlice.reducer;
