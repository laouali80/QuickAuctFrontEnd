import secure from "@/storage/secure";
import { api } from "../axiosInstance";
import { silentLogin } from "@/state/reducers/userSlice";

export const attemptSilentLogin = async (dispatch) => {
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

      // Dispatch to update Redux state if available
      if (dispatch) {
        dispatch(silentLogin(response.data));
      }
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
