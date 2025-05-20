// store/auctionsSlice.js
import apiRequest from "@/api/axiosInstance";
import { sendThroughSocket } from "@/core/auctionSocketManager";
import utils, { formatAuctionTime } from "@/core/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctions: [],
  isConnected: false,
  searchList: null,
  newAuctions: 0,
  NextPage: null,
  likesAuctions: [],
  bidsAuctions: [],
  salesAuctions: [],
  categories: [],
  error: null,
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
      const { auctions, nextPage, loaded } = action.payload;
      const newAuctions = auctions.map(addTimeLeft);

      const merged = loaded
        ? [...state.auctions, ...newAuctions]
        : [...newAuctions, ...state.auctions];

      // to remove duplicate id
      // Deduplicate by auction.id
      const unique = [];
      const seenIds = new Set();

      for (const auction of merged) {
        if (!seenIds.has(auction.id)) {
          seenIds.add(auction.id);
          unique.push(auction);
        }
      }
      // console.log(unique);
      state.auctions = unique;
      state.NextPage = nextPage;
    },
    addNewAuction(state, action) {
      const { seller, currentUserId } = action.payload;

      // Check if seller exists and isn't the current user
      if (seller?.userId && seller.userId !== currentUserId) {
        state.newAuctions = (state.newAuctions || 0) + 1;
      }
    },
    updateTime(state) {
      // state.auctions = [
      //   ...state.auctions
      //     .filter((auction) => auction.timeLeft !== "Completed")
      //     .map(updAuctTime),
      // ];

      state.auctions = state.auctions.map((auction) =>
        auction.timeLeft === "Completed" ? auction : updAuctTime(auction)
      );
    },
    auction_deleted(state, action) {
      state.auctions = state.auctions.filter(
        (auction) => auction.id !== action.payload
      );
    },
    auction_updated(state, action) {
      const updatedAuction = action.payload;

      state.auctions = state.auctions.map((auction) =>
        auction.id === updatedAuction.id ? updAuctTime(updatedAuction) : auction
      );
    },
    clearAuctions(state) {
      state.auctions = [];
      state.NextPage = null;
      state.likesAuctions = [];
      state.bidsAuctions = [];
      state.salesAuctions = [];
    },
    setLikesAuctions(state, action) {
      const { auctions, nextPage, loaded } = action.payload;

      const newAuctions = auctions.map(addTimeLeft);

      const merged = loaded
        ? [...state.likesAuctions, ...newAuctions]
        : [...newAuctions, ...state.likesAuctions];

      // to remove duplicate id
      // Deduplicate by auction.id
      const unique = [];
      const seenIds = new Set();

      for (const auction of merged) {
        if (!seenIds.has(auction.id)) {
          seenIds.add(auction.id);
          unique.push(auction);
        }
      }

      state.likesAuctions = unique;
      state.NextPage = nextPage;
    },
    setBidsAuctions(state, action) {
      const { auctions, nextPage, loaded } = action.payload;

      const newAuctions = auctions.map(addTimeLeft);

      const merged = loaded
        ? [...state.bidsAuctions, ...newAuctions]
        : [...newAuctions, ...state.bidsAuctions];

      // to remove duplicate id
      // Deduplicate by auction.id
      const unique = [];
      const seenIds = new Set();

      for (const auction of merged) {
        if (!seenIds.has(auction.id)) {
          seenIds.add(auction.id);
          unique.push(auction);
        }
      }

      state.bidsAuctions = unique;
      state.NextPage = nextPage;
    },
    setSalesAuctions(state, action) {
      const { auctions, nextPage, loaded } = action.payload;

      const newAuctions = auctions.map(addTimeLeft);

      const merged = loaded
        ? [...state.salesAuctions, ...newAuctions]
        : [...newAuctions, ...state.salesAuctions];

      // to remove duplicate id
      // Deduplicate by auction.id
      const unique = [];
      const seenIds = new Set();

      for (const auction of merged) {
        if (!seenIds.has(auction.id)) {
          seenIds.add(auction.id);
          unique.push(auction);
        }
      }

      state.salesAuctions = unique;
      state.NextPage = nextPage;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories Cases
      .addCase(fetchCategories.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // console.log("reach");
        state.categories = action.payload.categories;

        // state.status = "fulfilled";
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        // state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export const searchAuctions = (query) => (dispatch, getState) => {
  // console.log("query receive slice: ", query);
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

export const watchAuction = (data) => {
  // console.log("data: ", data);

  sendThroughSocket({
    source: "watch_auction",
    data,
  });
};

export const refresh = () => (dispatch) => {
  // clear old
  dispatch(auctionsSlice.actions.clearAuctions());

  sendThroughSocket({
    source: "FetchAuctionsList",
    data: { page: 1 },
  });
};

export const loadMore = (data) => {
  sendThroughSocket({
    source: "load_more",
    data,
  });
};

export const fetchLikesAuctions = (data) => (dispatch) => {
  console.log("fetchLikesAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions());

  sendThroughSocket({
    source: "likesAuctions",
    data,
  });
};

export const fetchBidsAuctions = (data) => (dispatch) => {
  console.log("fetchBidsAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions());

  sendThroughSocket({
    source: "bidsAuctions",
    data,
  });
};

export const fetchSalesAuctions = (data) => (dispatch) => {
  // console.log("fetchSalesAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions());

  sendThroughSocket({
    source: "salesAuctions",
    data,
  });
};

export const fetchAuctions = (data) => (dispatch) => {
  // console.log("fetchSalesAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions());

  sendThroughSocket({
    source: "FetchAuctionsListByCategory",
    data,
  });
};

export const fetchCategories = createAsyncThunk(
  "auctions/categories",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("categories fetching");
      const response = await apiRequest("auctions/categories/");
      // console.log("reach: ", response);

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUserAuctions = createAsyncThunk(
  "auctions/user",
  async (data, { rejectWithValue }) => {
    try {
      // console.log("token: ", data.token.access);
      const response = await apiRequest(
        "auctions/",
        null,
        "GET",
        {},
        data.token
      );

      // console.log("reach: ", response);

      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Selectors
export const getSearchList = (state) => state.auctions.searchList;
export const getAuctionsList = (state) => state.auctions.auctions;
export const getNewAuctions = (state) => state.auctions.newAuctions;
export const getAuction = (id) => (state) =>
  state.auctions.auctions.find((auction) => auction.id === id);
export const getAuctNextPage = (state) => state.auctions.NextPage;
export const getLikesAuctions = (state) => state.auctions.likesAuctions;
export const getBidsAuctions = (state) => state.auctions.bidsAuctions;
export const getSalesAuctions = (state) => state.auctions.salesAuctions;
export const getCategories = (state) => state.auctions.categories;

export const {
  setSocketConnected,
  setSocketDisconnected,
  setSearchList,
  updateTime,
} = auctionsSlice.actions;

export default auctionsSlice.reducer;
