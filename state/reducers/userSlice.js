import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import utils from "@/core/utils";
import secure from "@/storage/secure";
import { Platform } from "react-native";
// import secure from "@/core/secure";

// Helper function to avoid circular dependency
const makeApiRequest = async (url, data, method = "GET", headers = {}) => {
  const { apiRequest } = await import("@/api/axiosInstance");
  return apiRequest(url, data, method, headers);
};

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

      const response = await makeApiRequest("users/auth/login/", data, "POST");

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

      return { status, message, tokens, user };
    } catch (err) {
      await secure.clearUserSession();

      console.log("login error: ", err);

      // Log actual error if available
      // console.log("Login error:", err?.response?.data || err.message);
      // utils.log("catch error:", err.status);

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

      const response = await makeApiRequest("users/auth/register/", data, "POST");
      // const response = await apiRequest("users/");
      utils.log("Sign Up Response:", response);
      // secure.storeUserSession("accessToken", response.tokens.access);

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

      return rejectWithValue(err);
    }
  }
);

// Async Thunk: Email verification
export const EmailVerification = createAsyncThunk(
  "user/EmailVerification",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("email verification: ", data);
      const response = await makeApiRequest(
        "users/auth/verification/",
        data,
        "POST"
      );
      // console.log(response);
      utils.log("Email Verification Response:", response);

      if (response?.status !== "success") {
        throw {
          message: response.message || "Login failed",
          status: response.status || "error",
          statusCode: response.statusCode || 500,
        };
      }
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Async Thunk: OTP Validation User
export const OTPValidation = createAsyncThunk(
  "user/OTPValidation",
  async (data, { rejectWithValue }) => {
    try {
      console.log("otp validation: ", data);
      const response = await makeApiRequest(
        "users/auth/otpValidation/",
        data,
        "POST"
      );
      console.log("OTPValidation: ", response);

      if (response?.status !== "success") {
        throw {
          message: response.message || "Login failed",
          status: response.status || "error",
          statusCode: response.statusCode || 500,
        };
      }

      return response;
    } catch (err) {
      return rejectWithValue(err);
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
          ? await makeApiRequest("users/location/", data, "POST", {}, data.token)
          : await makeApiRequest("users/location/", data, "POST");

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

export const submitReport = createAsyncThunk(
  "reports/submitReport",
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await makeApiRequest("/report", reportData, "POST");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async Thunk: Update User
export const updateUser = createAsyncThunk(
  "user/UpdateUser",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("reach:  ", data?.token);

      const response = data?.tokens
        ? await apiRequest("users/update/", data, "PUT", {}, data.tokens)
        : await apiRequest("users/update/", data, "PUT");
      utils.log("Update User Response:", response);

      if (response?.status !== "success") {
        throw {
          message:
            response.statusCode === 422
              ? response.errors.username[0]
              : response.message || "Update failed",
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
      return rejectWithValue(err);
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
        state.initialized = true;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.status = action?.payload?.status || "error";
        state.message = action.payload?.message || "Login failed";
      })

      // SignUp Cases
      .addCase(signUpUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.initialized = true;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = action?.payload?.status || "error";
        state.message = action.payload?.message || "Registration failed";
      })

      // EmailVerification Cases
      .addCase(EmailVerification.pending, (state) => {
        state.status = "pending";
      })
      .addCase(EmailVerification.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(EmailVerification.rejected, (state, action) => {
        state.status = action?.payload?.status || "error";
        state.message = action.payload?.message || "Oops! Something went wrong";
      })

      // OTPValidation Cases
      .addCase(OTPValidation.pending, (state) => {
        state.status = "pending";
      })
      .addCase(OTPValidation.rejected, (state, action) => {
        state.status = action?.payload?.status || "error";
        state.message = action.payload?.message || "Oops! Something went wrong";
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
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.initialized = true;
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = action?.payload?.status || "error";
        state.message = action.payload?.message || "Login failed";
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
