// store/auctionsSlice.js
import { sendThroughSocket } from "@/core/auctionSocketManager";
import utils, { formatAuctionTime } from "@/core/utils";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctions: [],
  isConnected: false,
  searchList: null,
  newAuctions: 0,
};

const addTimeLeft = (auction) => {
  return {
    ...auction,
    timeLeft: formatAuctionTime(auction.end_time),
  };
};

const updAuctTime = (auction) => {
  return {
    ...auction,
    timeLeft: formatAuctionTime(auction.end_time),
  };
};

const auctionsSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {
    setSocketConnected(state) {
      state.isConnected = true;
    },
    setSocketDisconnected(state) {
      state.isConnected = false;
    },
    setSearchList(state, action) {
      // utils.log("setSearchList payload: ", action.payload);
      state.searchList = action.payload;
    },
    setAuctionsList(state, action) {
      // console.log("payload: ", action.payload);
      state.auctions = [...action.payload.map(addTimeLeft)];
    },
    addNewAuction(state, action) {
      const { seller, currentUserId } = action.payload;

      // Check if seller exists and isn't the current user
      if (seller?.userId && seller.userId !== currentUserId) {
        state.newAuctions = (state.newAuctions || 0) + 1;
      }
    },
    updateTime(state) {
      // console.log("call: ", [
      //   ...state.auctions
      //     .filter((auction) => auction.timeLeft !== "Completed")
      //     .map(updAuctTime),
      // ]);
      // state.auctions = [
      //   ...state.auctions
      //     .filter((auction) => auction.timeLeft !== "Completed")
      //     .map(updAuctTime),
      // ];

      state.auctions = state.auctions.map((auction) =>
        auction.timeLeft === "Completed" ? auction : updAuctTime(auction)
      );
    },
  },
});

export const searchAuctions = (query) => (dispatch, getState) => {
  console.log("query receive slice: ", query);
  if (query) {
    sendThroughSocket({
      source: "search",
      query,
    });
  } else {
    dispatch(auctionsSlice.actions.setSearchList(null));
  }
};

export const createAuction = (data) => {
  // console.log("data: ", data);

  sendThroughSocket({
    source: "create_auction",
    data,
  });
};

export const placeBid = (data) => {
  // console.log("data: ", data);

  sendThroughSocket({
    source: "place_bid",
    data,
  });
};

// Selectors
export const getSearchList = (state) => state.auctions.searchList;
export const getAuctionsList = (state) => state.auctions.auctions;
export const getNewAuctions = (state) => state.auctions.newAuctions;
export const {
  setSocketConnected,
  setSocketDisconnected,
  setSearchList,
  updateTime,
} = auctionsSlice.actions;

export default auctionsSlice.reducer;

// import utils from "@/core/utils";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";

// const initialState = {
//   auctions: [],
//   isConnected: false,
//   searchList: null,
// };

// // -----------------------------
// // WebSocket management functions
// // -------------------------------

// let socket = null;

// export const initializeAuctionSocket = createAsyncThunk(
//   "auctions/initializedConnection",
//   async (tokens, { dispatch, rejectWithValue }) => {
//     try {
//       if (socket) {
//         socket.close();
//       }

//       socket = new WebSocket(
//         `ws://${BaseAddress}/ws/auctions/?tokens=${tokens.access}`
//       );

//       socket.onopen = () => {
//         dispatch(setSocketConnected());
//       };

//       socket.onmessage = (event) => {
//         const parsed = JSON.parse(event.data);
//         const responses = {
//           // thumbnail: (data) => dispatch(updateThumbnail(data)),
//           search: (data) => dispatch(setSearchList(data)),
//         };
//         if (responses[parsed.source]) {
//           responses[parsed.source](parsed);
//         }
//       };

//       socket.onerror = (error) => {
//         console.error("WebSocket Error:", error);
//         dispatch(socketClose());
//       };

//       socket.onclose = () => {
//         dispatch(socketClose());
//       };

//       return true;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const socketClose = () => (dispatch) => {
//   if (socket) {
//     socket.close();
//     socket = null;
//     dispatch(setSocketDisconnected());
//   }
// };

// // -------------------
// //  Search Auctions
// // -------------------
// export const searchAuctions = (query) => {
//   // const dispatch = useDispatch(); // Get dispatch function

//   utils.log("receive query: ", query);
//   if (query) {
//     const socket = get().socket;

//     socket.send(
//       JSON.stringify({
//         source: "search",
//         query: query,
//       })
//     );
//   } else {
//     dispatch(setSearchList({ searchList: null }));
//   }
// };

// // auction slice
// const auctionsSlice = createSlice({
//   name: "auctions",
//   initialState: initialState,
//   reducers: {
//     // Actions
//     setSocketConnected(state) {
//       state.isConnected = true;
//     },
//     setSocketDisconnected(state) {
//       state.isConnected = false;
//     },
//     setSearchList(state, action) {
//       state.searchList = action.payload;
//     },
//   },
// });

// export const selectAllAuctions = (state) => state.auctions.auctions;
// export const getSearchList = (state) => state.auctions.searchList;

// // exporting the actions
// export const { setSearchList } = auctionsSlice.actions;

// // Exporting the reducer
// export default auctionsSlice.reducer;
