import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "../state/reducers/userSlice";
import auctionsReducer from "../state/reducers/auctionsSlice";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  auctions: auctionsReducer,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,

});

export { store };

export default store;
