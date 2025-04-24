import * as SecureStore from "expo-secure-store";

// Same function as Redux Persist but this one secure/encrypt our data and maybe more easier

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

// Remove data securely
async function removeUserSession(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log("success deletion token secure storage");
  } catch (error) {
    console.log("Error removing data: ", error);
  }
}

export default {
  storeUserSession,
  getUserSession,
  removeUserSession,
};
