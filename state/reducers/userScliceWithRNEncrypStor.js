// import apiRequest from "@/core/api";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import secure from "../../core/secure";

// const initialState = {
//   user: {},
//   tokens: "",
//   authenticated: false,
//   initialized: false,
//   error: null,
//   status: null,
// };

// // Async thunk for login
// export const logInUser = createAsyncThunk(
//   "user/logInUser",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await apiRequest("users/auth/login/", data, "POST");
//       console.log("Login Response:", response);

//       // Store credentials securely
//       await secure.storeUserSession("credentials", data);

//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // Async thunk for signup
// export const SignUpUser = createAsyncThunk(
//   "user/SignUpUser",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await apiRequest("users/auth/register/", data, "POST");

//       // Store credentials securely
//       await secure.storeUserSession("credentials", {
//         email: data.email,
//         password: data.password,
//       });

//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // Initialize user from secure storage
// export const initUser = createAsyncThunk(
//   "user/initUser",
//   async (_, { dispatch, rejectWithValue }) => {
//     try {
//       const credentials = await secure.getUserSession("credentials");

//       if (credentials) {
//         // Dispatch login with stored credentials
//         await dispatch(logInUser(credentials)).unwrap();
//       }

//       return { initialized: true };
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // User slice
// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     logOutUser(state) {
//       state.user = {};
//       state.tokens = "";
//       state.authenticated = false;
//       state.error = null;
//       state.status = null;
//       state.initialized = false;

//       // Remove credentials from secure storage
//       secure.removeUserSession("credentials");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Initialize user cases
//       .addCase(initUser.fulfilled, (state) => {
//         state.initialized = true;
//       })
//       .addCase(initUser.rejected, (state) => {
//         state.initialized = true;
//       })

//       // Login user cases
//       .addCase(logInUser.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(logInUser.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.tokens = action.payload.access_token; // Ensure correct property
//         state.authenticated = true;
//         state.initialized = true;
//         state.status = "fulfilled";
//         state.error = null;
//       })
//       .addCase(logInUser.rejected, (state, action) => {
//         state.status = "rejected";
//         state.error = action.payload;
//       })

//       // Signup user cases
//       .addCase(SignUpUser.pending, (state) => {
//         state.status = "pending";
//       })
//       .addCase(SignUpUser.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.tokens = action.payload.access_token; // Ensure correct property
//         state.authenticated = true;
//         state.status = "fulfilled";
//         state.error = null;
//       })
//       .addCase(SignUpUser.rejected, (state, action) => {
//         state.status = "rejected";
//         state.error = action.payload;
//       });
//   },
// });

// export const getAuthentication = (state) => state.user.authenticated;
// export const getInitialized = (state) => state.user.initialized;
// export const getUserInfo = (state) => state.user;
// export const getTokens = (state) => state.user.tokens;

// // Exporting actions
// export const { logOutUser } = userSlice.actions;

// // Exporting reducer
// export default userSlice.reducer;
