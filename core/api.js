import axios from "axios";
import { Platform } from "react-native";

// if using android studio
const BaseAddress =
  Platform.OS === "ios" ? "http://localhost:8000" : "http://10.0.2.2:8000";

// const BaseAddress = "http://localhost:8000";
const api = axios.create({
  baseURL: `${BaseAddress}/api/`,
  headers: {
    // Accept: "application/json",
    // "Content-Type": "multipart/form-data",
    "Content-Type": "application/json",
  },
  // httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL issues
});

// Add an interceptor to handle domain initialization
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       // Attempt to hit the root domain to initialize the connection
//       await axios.get("http://localhost:8000/api/users/");
//     } catch (error) {
//       console.log("Domain initialization failed:", error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
export default api;

// The updated apiRequest function
// export const apiRequest = async (
//   url: string,
//   data: any = null,
//   method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'PATCH'
// ) => {
//   try {
//     const response = await apiClient({
//       url: url,
//       method: method.toUpperCase(),
//       data: data | none,
//     });
//     console.log(url);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('API Request error:', {
//         message: error.message,
//         response: error.response ? error.response.data : null,
//         config: error.config,
//       });
//     } else {
//       console.error('Unexpected error:', error);
//     }
//     return null;
//   }
// };
