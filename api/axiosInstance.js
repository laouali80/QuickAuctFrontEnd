import axios from "axios";

import { Platform } from "react-native";
import secure from "../storage/secure";
import { BaseAddress, Protocol } from "@/constants/config";
import { refreshAccessToken } from "./authService/refreshToken";

// if using android studio
// const BaseAddress =
//   Platform.OS === "ios" ? "http://172.20.10.4:8000" : "http://10.0.2.2:8000";

export const api = axios.create({
  baseURL: `${Protocol}://${BaseAddress}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// The updated apiRequest function with dynamic headers
export const apiRequest = async (
  url,
  data = null,
  method = "GET",
  headers = {},
  overrideTokens = null,
  retry = true
  // dispatch = null // ✅ new parameter
) => {
  try {
    // Skip auth token logic for login or public routes
    const isAuthRoute = url.includes("/login") || url.includes("/register");

    // If no token then no need for Bearer token authorization
    const token = !isAuthRoute
      ? overrideTokens
        ? overrideTokens.access
        : await secure.getAccessToken()
      : null;

    // console.log("Tokens: ", token);

    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // console.log("header: ", headers);

    const response = await api({
      url: url,
      method: method.toUpperCase(),
      data: data,
      headers: {
        ...api.defaults.headers, // Preserve default headers
        ...authHeaders, // Add authorization token if any
        ...headers, // Merge with custom headers
      },
      withCredentials: true, // necessary for Django session cookies
    });

    // console.log("Request url: ", url);
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 401 &&
      retry &&
      error.response.data?.code === "token_not_valid"
    ) {
      console.log("Access token expired. Attempting refresh...");
      const refreshed = await refreshAccessToken(
        overrideTokens,
        (dispatch = null)
      );

      if (refreshed) {
        return apiRequest(
          url,
          data,
          method,
          headers,
          refreshedTokens === true ? null : refreshedTokens, // fallback to secureStore
          false
          // null
        ); // Retry once
      }
    }
    if (error.response) {
      // console.error("API Request Error:", error.response.data);
      // console.error("Status:", error.response.status);
    } else if (error.request) {
      // console.error("No response received:", error.request);
    } else {
      // console.error("General Error:", error.message);
    }
    // console.log("Error config: ", error.config);
    return null; // Prevent crashes by returning null
  }
};

export default apiRequest;
