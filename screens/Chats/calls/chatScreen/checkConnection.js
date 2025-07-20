import apiRequest from "@/api/axiosInstance";
import { Platform } from "react-native";

export const checkConnection = async (sellerId, tokens) => {
  const response =
    Platform.OS === "web"
      ? await apiRequest(
          `/chats/connections/${sellerId}`,
          null,
          "GET",
          {},
          tokens
        )
      : await apiRequest(`/chats/connections/${sellerId}`, null, "GET");
  return response;
};
