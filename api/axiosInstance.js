import axios from "axios";

import { Platform } from "react-native";
import secure from "../storage/secure";
import { BaseAddress, Protocol } from "@/constants/config";
import { resetTokens, silentLogin } from "@/state/reducers/userSlice";

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
    if (typeof url !== "string") {
      console.error(
        "🚨 apiRequest: Expected URL to be a string, got:",
        typeof url,
        url
      );
      throw new Error("apiRequest expected 'url' to be a string");
    }

    // Skip auth token logic for login or public routes
    const isAuthRoute = url.includes("/login") || url.includes("/register");

    // console.log("overrideTokens: ", overrideTokens);

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

      // console.log("overrideTokens: ", overrideTokens);

      if (refreshed) {
        return apiRequest(
          url,
          data,
          method,
          headers,
          overrideTokens !== null ? refreshed : null, // fallback to secureStore
          false
          // null
        ); // Retry once
      }
    }
    if (error.response) {
      console.error("API Request Error:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
      // console.error("No response received:", error.message);
    } else {
      console.error("General Error:", error.message);
    }
    // console.log("Error config: ", error.config);
    return error?.response?.data || error; // Prevent crashes by returning null
  }
};

export default apiRequest;

export const refreshAccessToken = async (overrideTokens = null, dispatch) => {
  try {
    const refreshToken = overrideTokens
      ? overrideTokens.refresh
      : await secure.getRefreshToken();

    // console.log("receive overrideTokens: ", overrideTokens);

    if (!refreshToken) throw new Error("No refresh token found");

    const response = await api({
      url: "users/auth/jwt/token/refresh/",
      method: "POST",
      data: {
        refresh: refreshToken,
      },
    });
    // console.log("response: ", response?.data.data);

    const tokens = response?.data?.data;
    if (tokens?.access && tokens?.refresh) {
      console.log("inside tokens: ", tokens?.access && tokens?.refresh);

      await secure.saveUserSession(tokens.access, tokens.refresh);

      // to update Redux state if available
      resetTokens(tokens);
    } else {
      throw new Error("Missing tokens in response");
    }

    console.log(overrideTokens ? "Web Refresh Token" : "Mobile Refresh Token");

    return overrideTokens ? tokens : true;
  } catch (err) {
    console.warn("Refresh token failed, attempting silent login...");
    return await attemptSilentLogin();
  }
};

export const attemptSilentLogin = async () => {
  try {
    // const credsRaw = await secure.getCredentials();
    const credsRaw = { email: "test@gmail.com", password: "test1234" };

    if (!credsRaw) return false;

    // const creds = JSON.parse(credsRaw);

    const response = await api({
      url: "users/auth/login/",
      method: "POST",
      data: credsRaw,
    });

    const { tokens } = response.data.data;

    // console.log("tokens silent: ", tokens);

    if (tokens?.access && tokens?.refresh) {
      await secure.saveUserSession(tokens.access, tokens.refresh);

      // // to update Redux state if available
      silentLogin(response.data.data);
    } else {
      throw new Error("Missing tokens in response");
    }

    console.log(
      Platform.OS === "web" ? "Web Silent login" : "Mobile Silent login"
    );

    return Platform.OS === "web" ? tokens : true;
  } catch (err) {
    console.error("Silent login failed:", err);
    await secure.clearUserSession();
    return false;
  }
};
