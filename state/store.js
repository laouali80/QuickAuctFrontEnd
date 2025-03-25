import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import userReducer from "../state/reducers/userSlice";
import auctionsReducer from "../state/reducers/auctionsSlice";

// ✅ Define persistConfig
const persistConfig = {
  key: "root",
  storage,
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  auctions: auctionsReducer,
});

// ✅ Persist the combined reducer BEFORE passing it to configureStore
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
        ignoredPaths: ["register"],
      },
    }),
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
