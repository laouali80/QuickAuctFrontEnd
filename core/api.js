import axios from "axios";

import { Platform } from "react-native";
import secure from "./secure";

// if using android studio
// const BaseAddress =
//   Platform.OS === "ios" ? "http://172.20.10.4:8000" : "http://10.0.2.2:8000";

// https://quick-auct-backend.vercel.app/api/users/

export const DEVELOPMENT = true;

export const BaseAddress = DEVELOPMENT
  ? "localhost:8000"
  : "quick-auct-backend.vercel.app";

export const Protocol = DEVELOPMENT ? "http" : "https";

const api = axios.create({
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
  headers = {}
) => {
  try {
    const token = await secure.getUserSession("accessToken");
    // console.log("token from secure", token);

    // If no token then no need for Bearer token authorization
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

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

    // console.log(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    } else if (error.request) {
      console.log(error);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
    return null; // Prevent crashes by returning null
  }
};

export default apiRequest;

// export const login = async (username, password) => {
//   const response = await fetch("http://localhost:8000/api/users/");
//   //   const response = await fetch("http://localhost:5555/login", {
//   //   method: "POST",
//   //   headers: { "Content-Type": "application/json" },
//   //   body: JSON.stringify({ username, password }),
//   // });
//   console.log(response);

//   if (response.ok) {
//     console.log(response);
//     const { token } = await response.json();

//     return token;
//   }
//   const errMessage = await response.json();
//   // console.log(errMessage);
//   throw new Error(errMessage.detail);
// };
