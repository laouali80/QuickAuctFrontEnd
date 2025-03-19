import axios from "axios";
import { Platform } from "react-native";

// if using android studio
// const BaseAddress =
//   Platform.OS === "ios" ? "http://localhost:8000" : "http://10.0.2.2:8000";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
