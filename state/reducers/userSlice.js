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
  message: null,
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

      const response = await apiRequest("users/auth/login/", data, "POST");

      // console.log("Redux state:", userSlice.getState());
      utils.log("Login Response:", response);

      if (response?.status !== "success") {
        throw {
          message: response.message || "Login failed",
          status: response.status || "error",
          statusCode: response.statusCode || 500,
        };
      }

      const { status, message } = response;
      const { tokens, user } = response.data;

      if (tokens?.access && tokens?.refresh) {
        await secure.saveUserSession(tokens.access, tokens.refresh);
      } else {
        throw new Error("Missing tokens in response");
      }

      return { status, message, tokens, tokens, user };
    } catch (err) {
      await secure.clearUserSession();

      // Log actual error if available
      // console.log("Login error:", err?.response?.data || err.message);
      utils.log("catch error:", err.status);

      // Normalize error message
      // const message =
      //   err?.response?.data?.detail || err?.message || "Login failed";

      return rejectWithValue(err);
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
      state.message = null;
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
      state.message = null;
    },
    clearMessage(state) {
      state.message = null;
      state.status = null;
    },
    setAuthenticated(state) {
      state.authenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(logInUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        // state.authenticated = true;
        state.initialized = true;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.status = action?.payload?.status || "rejected";
        state.message = action.payload?.message || "Login failed";
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
        state.message = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = action?.payload?.status || "rejected";
        state.message = action.payload?.message || "Registration failed";
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
        state.message = null;
      })
      .addCase(setLocation.rejected, (state, action) => {
        state.status = action?.payload?.status || "rejected";
        state.message = action.payload?.message || "Failed to geo Locate";
      });
  },
});

// Selectors
export const getAuthentication = (state) => state.user.authenticated;
export const getInitialized = (state) => state.user.initialized;
export const getUserInfo = (state) => state.user.user;
export const getTokens = (state) => state.user.tokens;
export const getMessage = (state) => state.user.message;
export const getStatus = (state) => state.user.status;

// Export Actions & Reducer
export const {
  logOutUser,
  updateThumbnail,
  resetTokens,
  silentLogin,
  clearMessage,
  setAuthenticated,
} = userSlice.actions;
export default userSlice.reducer;
