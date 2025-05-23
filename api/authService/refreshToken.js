import secure from "@/storage/secure";
import { api } from "../axiosInstance";
import { resetTokens } from "@/state/reducers/userSlice";
import { attemptSilentLogin } from "./attemptSilentLogin";

export const refreshAccessToken = async (overrideTokens = null, dispatch) => {
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

      // Dispatch to update Redux state if available
      if (dispatch) {
        dispatch(resetTokens(tokens));
      }
    } else {
      throw new Error("Missing tokens in response");
    }

    return overrideTokens ? tokens : true;
  } catch (err) {
    console.warn("Refresh token failed, attempting silent login...");
    return await attemptSilentLogin();
  }
};
