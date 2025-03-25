// Same function as Redux Persist but this one secure/encrypt our data and maybe more easier

import EncryptedStorage from "react-native-encrypted-storage";

// async function storeUserSession() {
//   try {
//       await EncryptedStorage.setItem(
//           "user_session",
//           JSON.stringify({
//               age : 21,
//               token : "ACCESS_TOKEN",
//               username : "emeraldsanto",
//               languages : ["fr", "en", "de"]
//           })
//       );

//       // Congrats! You've just stored your first value!
//   } catch (error) {
//       // There was an error on the native side
//   }
// }

async function storeUserSession(key, object) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(object));
  } catch (error) {
    //There was an error on the native side
    console.log("secure.storeUserSession: ", error);
  }
}

async function getUserSession(key) {
  try {
    const data = await EncryptedStorage.getItem(key);

    if (data !== undefined) {
      return JSON.parse(data);
    }
  } catch (error) {
    //There was an error on the native side
    console.log("secure.get: ", error);
  }
}

async function removeUserSession(key) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    //There was an error on the native side
    console.log("secure.remove: ", error);
  }
}

async function whipeUserSession() {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    //There was an error on the native side
    console.log("secure.whipe: ", error);
  }
}

export default {
  storeUserSession,
  getUserSession,
  removeUserSession,
  whipeUserSession,
};
