import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "@/api/axiosInstance";
import utils from "@/core/utils";
import secure from "@/storage/secure";
import { Platform } from "react-native";
// import secure from "@/core/secure";

const initialState = {
  user: null,
  tokens: null,
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
      // Optionally save credentials (if needed for re-login or biometric auth)
      await secure.saveUserCredentials(data.email, data.password);
      // console.log("data: ", data);

      await secure.saveUserCredentials(data.email, data.password);
      const response = await apiRequest("users/auth/login/", data, "POST");

      // console.log("Redux state:", userSlice.getState());
      utils.log("Login Response:", response);

      const tokens = response?.data?.tokens;
      const user = response?.data?.user;

      if (tokens?.access && tokens?.refresh) {
        await secure.saveUserSession(tokens.access, tokens.refresh);
      } else {
        throw new Error("Missing tokens in response");
      }

      return { tokens, user };
    } catch (err) {
      await secure.clearUserSession();

      // Log actual error if available
      // utils.log("Login error:", err?.response?.data || err.message);
      // utils.log("Login error:", err);

      // Normalize error message
      const message =
        err?.response?.data?.detail || err?.message || "Login failed";

      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Sign Up User
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (data, { rejectWithValue }) => {
    try {
      // Optionally save credentials (if needed for re-login or biometric auth)
      await secure.saveUserCredentials(data.email, data.password);

      const response = await apiRequest("users/auth/register/", data, "POST");
      // const response = await apiRequest("users/");
      utils.log("Sign Up Response:", response);
      // secure.storeUserSession("accessToken", response.tokens.access);

      const tokens = response?.data?.tokens;
      if (tokens?.access && tokens?.refresh) {
        await secure.saveUserSession(tokens.access, tokens.refresh);
      } else {
        throw new Error("Missing tokens in response");
      }

      return response.data;
    } catch (err) {
      await secure.clearUserSession();

      // Log actual error if available
      // utils.log("Login error:", err?.response?.data || err.message);
      // utils.log("Login error:", err);

      // Normalize error message
      const message =
        err?.response?.data?.detail || err?.message || "Sign Up failed";

      return rejectWithValue(message);
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

      console.log("Latest Location: ", data);
      const response =
        Platform.OS === "web"
          ? await apiRequest("users/location/", data, "POST", {}, data.token)
          : await apiRequest("users/location/", data, "POST");

      console.log("location response", response);

      const tokens = response?.data?.tokens;
      if (tokens?.access && tokens?.refresh) {
        await secure.saveUserSession(tokens.access, tokens.refresh);
      } else {
        throw new Error("Missing tokens in response");
      }

      return response.data;
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
    },
    // setLocation(state, action) {
    //   state.user.location = action.payload;
    // },
    resetTokens(state, action) {
      // console.log("reach resettttttttt: ", action.payload.tokens);
      state.tokens = action.payload.tokens;
    },
    silentLogin(state, action) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.authenticated = true;
      state.initialized = true;
      state.status = "fulfilled";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(logInUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        try {
          // console.log("🟡 Tokens received:", action.payload.tokens);
          // console.log("🟡 User received:", action.payload.user);
          // console.log("🟡 Tokens type:", typeof action.payload.tokens);
          // console.log("🟡 User type:", typeof action.payload.user);
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
          state.authenticated = true;
          state.initialized = true;
          state.status = "fulfilled";
          state.error = null;
        } catch (err) {
          console.error("Failed to set login state:", err);
          // state.status = "rejected";
          // state.error = "Error updating login state";
        }
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
export const { logOutUser, updateThumbnail, resetTokens, silentLogin } =
  userSlice.actions;
export default userSlice.reducer;
