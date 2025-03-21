import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { PersistGate } from "redux-persist/integration/react";
import userReducer from "../state/reducers/userSlice";
import auctionsReducer from "../state/reducers/auctionsSlice";
import { addContact } from "./reducers_or_slices/contactsSlice";
import { updateLastAddedContact } from "./reducers_or_slices/userSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  auctions: auctionsReducer,
});

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PURGE", "persist/REHYDRATE"], // Ignore Redux-Persist actions
      },
    }),
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };

export default store;
