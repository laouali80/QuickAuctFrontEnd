// authManager.js

import { api } from "./axiosInstance";
import secure from "../storage/secure";
import { useDispatch } from "react-redux";
import { resetTokens, silentLogin } from "@/state/reducers/userSlice";

export const refreshAccessToken = async (overrideTokens = null) => {
  const dispatch = useDispatch();
  try {
    const refreshToken = overrideTokens
      ? overrideTokens.refresh
      : await secure.getRefreshToken();

    if (!refreshToken) throw new Error("No refresh token found");

    const response = await api({
      url: "users/auth/jwt/token/refresh/",
      method: "POST",
      data: {
        refresh: refreshToken,
      },
    });

    const tokens = response.data?.tokens;
    if (tokens?.access && tokens?.refresh) {
      await secure.saveUserSession(tokens.access, tokens.refresh);
      dispatch(resetTokens(tokens));
    } else {
      throw new Error("Missing tokens in response");
    }

    return overrideTokens ? tokens : true;
  } catch (err) {
    console.warn("Refresh token failed, attempting silent login...");
    return await attemptSilentLogin();
  }
};

export const attemptSilentLogin = async () => {
  try {
    const credsRaw = await secure.getCredentials();
    if (!credsRaw) return false;

    const creds = JSON.parse(credsRaw);

    const response = await api({
      url: "users/auth/login/",
      method: "POST",
      data: creds,
    });

    const { tokens } = response.data;

    if (tokens?.access && tokens?.refresh) {
      await secure.saveUserSession(tokens.access, tokens.refresh);
      dispatch(silentLogin(response.data));
    } else {
      throw new Error("Missing tokens in response");
    }

    return true;
  } catch (err) {
    console.error("Silent login failed:", err);
    await secure.clearUserSession();
    return false;
  }
};
