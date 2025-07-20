import apiRequest from "@/api/axiosInstance";
import { Platform } from "react-native";

export const fetchMessages = async (connId, tokens) => {
  const response =
    Platform.OS === "web"
      ? await apiRequest(`/chats/messages/${connId}`, null, "GET", {}, tokens)
      : await apiRequest(`/chats/messages/${connId}`, null, "GET");
  return response;
};
