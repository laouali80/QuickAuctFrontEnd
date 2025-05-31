import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import AsyncStorage from "@react-native-async-storage/async-storage";
import userReducer from "../state/reducers/userSlice";
import auctionsReducer from "../state/reducers/auctionsSlice";
import chatsReducer from "../state/reducers/chatsSlice";

//  Define persistConfig
const persistConfig = {
  key: "root",
  // storage,
  storage: AsyncStorage,
};

//  Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  auctions: auctionsReducer,
  chats: chatsReducer,
});

//  Persist the combined reducer BEFORE passing it to configureStore
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Create store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
        ],
        // ignoredPaths: ["register"],
      },
    }),
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
