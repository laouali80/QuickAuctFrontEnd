// import { refreshAccessToken } from "@/api/axiosInstance";

export const refreshSocketTokenIfNeeded = async (currentToken) => {
  try {
    const payload = JSON.parse(atob(currentToken.split(".")[1]));
    const isExpired = Date.now() >= payload.exp * 1000; // Convert to ms and compare

    console.log("isExpired:", isExpired, "Current token:", currentToken);
    if (!isExpired) return currentToken;

    return currentToken;

    // console.log("🔐 Socket token expired. Refreshing...");
    // const refreshed = await refreshAccessToken();

    // if (refreshed?.access) {
    //   return refreshed.access;
    // }

    // return null;
  } catch (err) {
    console.error("Token refresh check failed:", err);
    return null;
  }
};
