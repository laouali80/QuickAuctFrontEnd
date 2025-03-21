import { createSlice } from "@reduxjs/toolkit";
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
    updateUser(state, action) {
      Object.assign(state, action.payload); // Immer handles immutability
    },
    logOutUser(state) {
      (state.user = {}), (state.tokens = "");
      state.authenticated = false;
    },

    extraReducers(builder) {
      builder
        .addCase(logInUser.pending, (state) => {
          state.status = "pending";
        })
        .addCase(logInUser.fulfilled, (state, action) => {
          state.status = action.payload.status;
          state.token = action.payload.token;
          state.loginErr = null; // Clear any previous error
        })
        .addCase(logInUser.rejected, (state, action) => {
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

// exporting the actions
export const { updateUser, updateLastAddedContact } = userSlice.actions;

// Exporting the reducer
export default userSlice.reducer;
