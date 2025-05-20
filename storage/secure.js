import * as SecureStore from "expo-secure-store";

// Same function as Redux Persist but this one secure/encrypt our data and maybe more easier

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const CREDENTIALS_KEY = "credentials";

// Store data securely
async function storeUserSession(key, value) {
  console.log("reach: ", key, value);
  try {
    const toStore = typeof value === "string" ? value : JSON.stringify(value);
    await SecureStore.setItemAsync(key, toStore);
  } catch (error) {
    console.log("Error storing data: ", error);
  }
}

const saveUserSession = async (access, refresh) => {
  try {
    await SecureStore.setItemAsync("ACCESS_TOKEN_KEY", access);
    await SecureStore.setItemAsync("REFRESH_TOKEN_KEY", refresh);
    console.log("successsssssssssssssss");
  } catch (error) {
    console.log("Error storing Tokens: ", error);
  }
};

const saveUserCredentials = async (email, password) => {
  try {
    const creds = JSON.stringify({ email, password });
    await SecureStore.setItemAsync("CREDENTIALS_KEY", creds);
  } catch (error) {
    console.log("Error storing CREDENTIALS_KEY: ", error);
  }
};

// Get data securely
async function getUserSession(key) {
  try {
    const value = await SecureStore.getItemAsync(key);

    try {
      return JSON.parse(value);
    } catch {
      return value; // return raw string if not JSON
    }
  } catch (error) {
    console.log("Error retrieving data: ", error);
    return null;
  }
}

const getAccessToken = async () => {
  try {
    const value = await SecureStore.getItemAsync("ACCESS_TOKEN_KEY");

    try {
      return JSON.parse(value);
    } catch {
      return value; // return raw string if not JSON
    }
  } catch (error) {
    console.log("Error retrieving ACCESS_TOKEN_KEY: ", error);
    return null;
  }
};

const getCredentials = async () => {
  try {
    const value = await SecureStore.getItemAsync("CREDENTIALS_KEY");

    try {
      return JSON.parse(value);
    } catch {
      return value; // return raw string if not JSON
    }
  } catch (error) {
    console.log("Error retrieving CREDENTIALS_KEY: ", error);
    return null;
  }
};

const getRefreshToken = async () => {
  try {
    const value = await SecureStore.getItemAsync("REFRESH_TOKEN_KEY");

    try {
      return JSON.parse(value);
    } catch {
      return value; // return raw string if not JSON
    }
  } catch (error) {
    console.log("Error retrieving REFRESH_TOKEN_KEY: ", error);
    return null;
  }
};

// Remove data securely
const clearUserSession = async () => {
  try {
    await SecureStore.deleteItemAsync("ACCESS_TOKEN_KEY");
    await SecureStore.deleteItemAsync("REFRESH_TOKEN_KEY");
    await SecureStore.deleteItemAsync("CREDENTIALS_KEY");
    console.log("success deletion token secure storage");
  } catch (error) {
    console.log("Error removing data: ", error);
    return false;
  }
};

// async function removeUserSession(key) {
//   try {
//     await SecureStore.deleteItemAsync(key);
//     console.log("success deletion token secure storage");
//   } catch (error) {
//     console.log("Error removing data: ", error);
//   }
// }

export default {
  saveUserSession,
  saveUserCredentials,
  getAccessToken,
  getCredentials,
  getRefreshToken,
  storeUserSession,
  getUserSession,
  clearUserSession,
};
