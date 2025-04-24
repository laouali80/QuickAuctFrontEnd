import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "@/core/api";
import utils from "@/core/utils";
import secure from "@/core/secure";
import { Platform } from "react-native";
// import secure from "@/core/secure";

const initialState = {
  user: {},
  tokens: "",
  authenticated: false,
  initialized: false,
  error: null,
  status: null,
};

// Async Thunk: Login User
export const logInUser = createAsyncThunk(
  "user/logInUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiRequest("users/auth/login/", data, "POST");
      utils.log("Login Response:", response.data);
      // utils.log("b4 call:");
      // let store = await secure.storeUserSession(
      //   "accessToken",
      //   response.tokens.access
      // );
      // utils.log("after call:", store);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async Thunk: Sign Up User
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiRequest("users/auth/register/", data, "POST");
      // const response = await apiRequest("users/");
      utils.log("Sign Up Response:", response);
      // secure.storeUserSession("accessToken", response.tokens.access);

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async Thunk: Email verification
export const EmailVerification = createAsyncThunk(
  "user/EmailVerification",
  async (data, { rejectWithValue }) => {
    try {
      console.log("email verification: ", data);
      const response = await apiRequest(
        "users/auth/verification/",
        data,
        "POST"
      );
      // console.log(response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async Thunk: OTP Validation User
export const OTPValidation = createAsyncThunk(
  "user/OTPValidation",
  async (data, { rejectWithValue }) => {
    try {
      console.log("otp validation: ", data);
      const response = await apiRequest(
        "users/auth/otpValidation/",
        data,
        "POST"
      );
      console.log(response);

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const setLocation = createAsyncThunk(
  "user/location",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("test: ", data.token.access);

      // console.log("Latest Location: ", data);
      const response =
        Platform.OS === "web"
          ? await apiRequest("users/location/", data, "POST", {
              Authorization: `Bearer ${data.token.access}`,
            })
          : await apiRequest("users/location/", data, "POST");

      console.log("location response", response);

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateThumbnail(state, action) {
      state.user = action.payload;
    },
    logOutUser(state) {
      state.user = {};
      state.tokens = "";
      state.authenticated = false;
      state.error = null;
      state.status = null;
      state.initialized = false;
      // secure.removeUserSession("accessToken");
    },
    // setLocation(state, action) {
    //   state.user.location = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(logInUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        // console.log("reach");
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.authenticated = true;
        state.initialized = true;
        state.status = "fulfilled";
        state.error = null;
        secure.storeUserSession("accessToken", action.payload.tokens.access);
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })

      // SignUp Cases
      .addCase(signUpUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.authenticated = true;
        state.status = "fulfilled";
        state.error = null;
        secure.storeUserSession("accessToken", action.payload.tokens.access);
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })

      // Update Location
      .addCase(setLocation.pending, (state) => {
        state.status = "pending";
      })
      .addCase(setLocation.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.authenticated = true;
        state.status = "fulfilled";
        state.error = null;
        secure.storeUserSession("accessToken", action.payload.tokens.access);
      })
      .addCase(setLocation.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

// Selectors
export const getAuthentication = (state) => state.user.authenticated;
export const getInitialized = (state) => state.user.initialized;
export const getUserInfo = (state) => state.user.user;
export const getTokens = (state) => state.user.tokens;

// Export Actions & Reducer
export const { logOutUser, updateThumbnail } = userSlice.actions;
export default userSlice.reducer;
