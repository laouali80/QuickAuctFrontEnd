// Same function as Redux Persist but this one secure/encrypt our data and maybe more easier

import * as SecureStore from 'expo-secure-store';

// Store data securely
async function storeUserSession(key, object) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(object));
  } catch (error) {
    console.log("Error storing data: ", error);
  }
}

// Get data securely
async function getUserSession(key) {
  try {
    const data = await SecureStore.getItemAsync(key);
    if (data) {
      return JSON.parse(data);  // Parse the stringified data to object
    }
    return null;
  } catch (error) {
    console.log("Error retrieving data: ", error);
    return null;
  }
}

// Remove data securely
async function removeUserSession(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing data: ", error);
  }
}

export default {
  storeUserSession,
  getUserSession,
  removeUserSession,
};
