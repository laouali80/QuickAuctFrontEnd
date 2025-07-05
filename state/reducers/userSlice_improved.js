import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "@/api/axiosInstance";
import utils from "@/core/utils";
import secure from "@/storage/secure";
import { Platform } from "react-native";

// Improved initial state structure
const initialState = {
  // User data
  user: {
    profile: null,
    preferences: {
      notifications: true,
      location: true,
      theme: 'light',
      language: 'en'
    },
    activity: {
      lastLogin: null,
      loginCount: 0,
      lastActive: null
    }
  },
  
  // Authentication state
  auth: {
    isAuthenticated: false,
    isInitialized: false,
    sessionExpiry: null,
    requiresReauth: false
  },
  
  // Token management
  tokens: {
    access: null,
    refresh: null,
    expiresAt: null,
    refreshExpiresAt: null
  },
  
  // UI state
  ui: {
    loading: {
      login: false,
      signup: false,
      update: false,
      verification: false
    },
    errors: {
      login: null,
      signup: null,
      update: null,
      verification: null
    },
    messages: {
      success: null,
      info: null,
      warning: null
    }
  },
  
  // Security
  security: {
    biometricEnabled: false,
    twoFactorEnabled: false,
    lastPasswordChange: null,
    failedLoginAttempts: 0,
    accountLocked: false
  }
};

// Utility functions
const calculateTokenExpiry = (expiresIn) => {
  return Date.now() + (expiresIn * 1000);
};

const isTokenExpired = (expiresAt) => {
  return Date.now() >= expiresAt;
};

const shouldRefreshToken = (refreshExpiresAt) => {
  // Refresh if token expires in next 5 minutes
  return Date.now() >= (refreshExpiresAt - 5 * 60 * 1000);
};

// Enhanced async thunks with better error handling
export const logInUser = createAsyncThunk(
  "user/logInUser",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      // Don't store credentials for security
      const response = await apiRequest("users/auth/login/", credentials, "POST");
      
      if (response?.status !== "success") {
        throw {
          message: response.message || "Login failed",
          status: response.status || "error",
          statusCode: response.statusCode || 500,
        };
      }

      const { tokens, user } = response.data;
      
      if (!tokens?.access || !tokens?.refresh) {
        throw new Error("Invalid token response");
      }

      // Calculate expiry times
      const accessExpiry = calculateTokenExpiry(tokens.expires_in || 3600);
      const refreshExpiry = calculateTokenExpiry(tokens.refresh_expires_in || 604800);

      // Save tokens securely
      await secure.saveUserSession(tokens.access, tokens.refresh);
      
      // Update user activity
      const updatedUser = {
        ...user,
        activity: {
          lastLogin: new Date().toISOString(),
          loginCount: (user.activity?.loginCount || 0) + 1,
          lastActive: new Date().toISOString()
        }
      };

      return {
        user: updatedUser,
        tokens: {
          access: tokens.access,
          refresh: tokens.refresh,
          expiresAt: accessExpiry,
          refreshExpiresAt: refreshExpiry
        }
      };
    } catch (error) {
      // Increment failed login attempts
      dispatch(userSlice.actions.incrementFailedLoginAttempts());
      
      await secure.clearUserSession();
      return rejectWithValue({
        message: error.message || "Login failed",
        status: "error",
        statusCode: error.statusCode || 500
      });
    }
  }
);

export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiRequest("users/auth/register/", userData, "POST");
      
      if (response?.status !== "success") {
        throw {
          message: response.message || "Registration failed",
          status: response.status || "error",
          statusCode: response.statusCode || 500,
        };
      }

      const { tokens, user } = response.data;
      
      if (!tokens?.access || !tokens?.refresh) {
        throw new Error("Invalid token response");
      }

      const accessExpiry = calculateTokenExpiry(tokens.expires_in || 3600);
      const refreshExpiry = calculateTokenExpiry(tokens.refresh_expires_in || 604800);

      await secure.saveUserSession(tokens.access, tokens.refresh);

      return {
        user: {
          ...user,
          activity: {
            lastLogin: new Date().toISOString(),
            loginCount: 1,
            lastActive: new Date().toISOString()
          }
        },
        tokens: {
          access: tokens.access,
          refresh: tokens.refresh,
          expiresAt: accessExpiry,
          refreshExpiresAt: refreshExpiry
        }
      };
    } catch (error) {
      await secure.clearUserSession();
      return rejectWithValue({
        message: error.message || "Registration failed",
        status: "error",
        statusCode: error.statusCode || 500
      });
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.user.tokens.refresh;
      
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiRequest("users/auth/refresh/", {
        refresh: refreshToken
      }, "POST");

      if (response?.status !== "success") {
        throw new Error("Token refresh failed");
      }

      const { access, refresh } = response.data.tokens;
      
      const accessExpiry = calculateTokenExpiry(response.data.expires_in || 3600);
      const refreshExpiry = calculateTokenExpiry(response.data.refresh_expires_in || 604800);

      await secure.saveUserSession(access, refresh);

      return {
        access,
        refresh,
        expiresAt: accessExpiry,
        refreshExpiresAt: refreshExpiry
      };
    } catch (error) {
      // Clear session on refresh failure
      await secure.clearUserSession();
      return rejectWithValue({
        message: "Session expired. Please login again.",
        status: "error"
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const tokens = state.user.tokens;
      
      const response = await apiRequest(
        "users/update/",
        userData,
        "PUT",
        {},
        tokens
      );

      if (response?.status !== "success") {
        throw {
          message: response.statusCode === 422
            ? response.errors?.username?.[0] || "Validation failed"
            : response.message || "Update failed",
          status: response.status || "error",
          statusCode: response.statusCode || 500,
        };
      }

      const { tokens: newTokens, user } = response.data;
      
      // Update tokens if provided
      if (newTokens?.access && newTokens?.refresh) {
        const accessExpiry = calculateTokenExpiry(newTokens.expires_in || 3600);
        const refreshExpiry = calculateTokenExpiry(newTokens.refresh_expires_in || 604800);
        
        await secure.saveUserSession(newTokens.access, newTokens.refresh);
        
        return {
          user,
          tokens: {
            access: newTokens.access,
            refresh: newTokens.refresh,
            expiresAt: accessExpiry,
            refreshExpiresAt: refreshExpiry
          }
        };
      }

      return { user };
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Update failed",
        status: "error",
        statusCode: error.statusCode || 500
      });
    }
  }
);

export const logOutUser = createAsyncThunk(
  "user/logOutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint to invalidate tokens
      await apiRequest("users/auth/logout/", {}, "POST");
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      await secure.clearUserSession();
    }
  }
);

// Improved slice with better state management
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Authentication actions
    setAuthenticated(state, action) {
      state.auth.isAuthenticated = action.payload;
    },
    
    setInitialized(state, action) {
      state.auth.isInitialized = action.payload;
    },
    
    setSessionExpiry(state, action) {
      state.auth.sessionExpiry = action.payload;
    },
    
    setRequiresReauth(state, action) {
      state.auth.requiresReauth = action.payload;
    },
    
    // User profile actions
    updateUserProfile(state, action) {
      state.user.profile = { ...state.user.profile, ...action.payload };
    },
    
    updateUserPreferences(state, action) {
      state.user.preferences = { ...state.user.preferences, ...action.payload };
    },
    
    updateUserActivity(state, action) {
      state.user.activity = { ...state.user.activity, ...action.payload };
    },
    
    // Token actions
    updateTokens(state, action) {
      state.tokens = { ...state.tokens, ...action.payload };
    },
    
    clearTokens(state) {
      state.tokens = {
        access: null,
        refresh: null,
        expiresAt: null,
        refreshExpiresAt: null
      };
    },
    
    // UI actions
    setLoading(state, action) {
      const { type, loading } = action.payload;
      state.ui.loading[type] = loading;
    },
    
    setError(state, action) {
      const { type, error } = action.payload;
      state.ui.errors[type] = error;
      state.ui.loading[type] = false;
    },
    
    setMessage(state, action) {
      const { type, message } = action.payload;
      state.ui.messages[type] = message;
    },
    
    clearMessages(state) {
      state.ui.messages = {
        success: null,
        info: null,
        warning: null
      };
    },
    
    clearErrors(state) {
      state.ui.errors = {
        login: null,
        signup: null,
        update: null,
        verification: null
      };
    },
    
    // Security actions
    setBiometricEnabled(state, action) {
      state.security.biometricEnabled = action.payload;
    },
    
    setTwoFactorEnabled(state, action) {
      state.security.twoFactorEnabled = action.payload;
    },
    
    incrementFailedLoginAttempts(state) {
      state.security.failedLoginAttempts += 1;
      if (state.security.failedLoginAttempts >= 5) {
        state.security.accountLocked = true;
      }
    },
    
    resetFailedLoginAttempts(state) {
      state.security.failedLoginAttempts = 0;
      state.security.accountLocked = false;
    },
    
    // Legacy compatibility
    clearUserState: (state) => {
      state.user.profile = null;
      state.auth.isAuthenticated = false;
      state.auth.isInitialized = false;
      state.tokens = {
        access: null,
        refresh: null,
        expiresAt: null,
        refreshExpiresAt: null
      };
      state.ui.messages = { success: null, info: null, warning: null };
      state.ui.errors = { login: null, signup: null, update: null, verification: null };
    },
    
    updateThumbnail(state, action) {
      if (state.user.profile) {
        state.user.profile = { ...state.user.profile, ...action.payload };
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(logInUser.pending, (state) => {
        state.ui.loading.login = true;
        state.ui.errors.login = null;
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.user.profile = action.payload.user;
        state.tokens = action.payload.tokens;
        state.auth.isAuthenticated = true;
        state.auth.isInitialized = true;
        state.auth.requiresReauth = false;
        state.ui.loading.login = false;
        state.ui.messages.success = "Login successful";
        state.security.failedLoginAttempts = 0;
        state.security.accountLocked = false;
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.ui.loading.login = false;
        state.ui.errors.login = action.payload?.message || "Login failed";
        state.auth.isAuthenticated = false;
      })
      
      // Signup cases
      .addCase(signUpUser.pending, (state) => {
        state.ui.loading.signup = true;
        state.ui.errors.signup = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user.profile = action.payload.user;
        state.tokens = action.payload.tokens;
        state.auth.isAuthenticated = true;
        state.auth.isInitialized = true;
        state.ui.loading.signup = false;
        state.ui.messages.success = "Registration successful";
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.ui.loading.signup = false;
        state.ui.errors.signup = action.payload?.message || "Registration failed";
      })
      
      // Token refresh cases
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.tokens = action.payload;
        state.auth.requiresReauth = false;
      })
      .addCase(refreshUserToken.rejected, (state) => {
        state.auth.requiresReauth = true;
        state.auth.isAuthenticated = false;
      })
      
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.ui.loading.update = true;
        state.ui.errors.update = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload.user) {
          state.user.profile = action.payload.user;
        }
        if (action.payload.tokens) {
          state.tokens = action.payload.tokens;
        }
        state.ui.loading.update = false;
        state.ui.messages.success = "Profile updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.ui.loading.update = false;
        state.ui.errors.update = action.payload?.message || "Update failed";
      })
      
      // Logout cases
      .addCase(logOutUser.fulfilled, (state) => {
        state.user.profile = null;
        state.auth.isAuthenticated = false;
        state.auth.isInitialized = false;
        state.tokens = {
          access: null,
          refresh: null,
          expiresAt: null,
          refreshExpiresAt: null
        };
        state.ui.messages = { success: null, info: null, warning: null };
        state.ui.errors = { login: null, signup: null, update: null, verification: null };
      });
  }
});

// Enhanced selectors with memoization
export const selectIsAuthenticated = (state) => state.user.auth.isAuthenticated;
export const selectIsInitialized = (state) => state.user.auth.isInitialized;
export const selectRequiresReauth = (state) => state.user.auth.requiresReauth;
export const selectUserProfile = (state) => state.user.user.profile;
export const selectUserPreferences = (state) => state.user.user.preferences;
export const selectUserActivity = (state) => state.user.user.activity;
export const selectAccessToken = (state) => state.user.tokens.access;
export const selectRefreshToken = (state) => state.user.tokens.refresh;
export const selectTokenExpiry = (state) => state.user.tokens.expiresAt;
export const selectIsTokenExpired = (state) => {
  const expiresAt = state.user.tokens.expiresAt;
  return expiresAt ? isTokenExpired(expiresAt) : true;
};
export const selectShouldRefreshToken = (state) => {
  const refreshExpiresAt = state.user.tokens.refreshExpiresAt;
  return refreshExpiresAt ? shouldRefreshToken(refreshExpiresAt) : true;
};
export const selectLoading = (type) => (state) => state.user.ui.loading[type];
export const selectError = (type) => (state) => state.user.ui.errors[type];
export const selectMessage = (type) => (state) => state.user.ui.messages[type];
export const selectSecurity = (state) => state.user.security;
export const selectIsAccountLocked = (state) => state.user.security.accountLocked;

// Legacy selectors for compatibility
export const getAuthentication = selectIsAuthenticated;
export const getInitialized = selectIsInitialized;
export const getUserInfo = selectUserProfile;
export const getTokens = (state) => state.user.tokens;
export const getMessage = (state) => state.user.ui.messages.success;
export const getStatus = (state) => state.user.ui.loading.login ? "pending" : "fulfilled";

export const {
  setAuthenticated,
  setInitialized,
  setSessionExpiry,
  setRequiresReauth,
  updateUserProfile,
  updateUserPreferences,
  updateUserActivity,
  updateTokens,
  clearTokens,
  setLoading,
  setError,
  setMessage,
  clearMessages,
  clearErrors,
  setBiometricEnabled,
  setTwoFactorEnabled,
  incrementFailedLoginAttempts,
  resetFailedLoginAttempts,
  clearUserState,
  updateThumbnail
} = userSlice.actions;

export default userSlice.reducer; 