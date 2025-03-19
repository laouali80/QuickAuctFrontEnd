import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  accesstoken: "",
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    // Actions
    updateUser(state, action) {
      Object.assign(state, action.payload); // Immer handles immutability
    },
    updateLastAddedContact(state, action) {
      state.lastAdded = action.payload;
    },
  },
});

// exporting the actions
export const { updateUser, updateLastAddedContact } = userSlice.actions;

// Exporting the reducer
export default userSlice.reducer;
