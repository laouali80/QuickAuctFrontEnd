import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctions: [],
  status: null,
  error: null,
};

// User slice
const auctionsSlice = createSlice({
  name: "auctions",
  initialState: initialState,
  reducers: {
    // Actions
    updateUser(state, action) {
      Object.assign(state, action.payload); // Immer handles immutability
    },
  },
});

export const selectAllAuctions = (state) => state.auctions.auctions;
export const getAuctionsStatus = (state) => state.auctions.status;
export const getAuctionsError = (state) => state.auctions.error;

// exporting the actions
export const { updateUser } = auctionsSlice.actions;

// Exporting the reducer
export default auctionsSlice.reducer;
