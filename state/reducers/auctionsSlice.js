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
  totalAuctions: 0,
  message: null,
  status: null,
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
      state.message = "Network disconnected. Please check your connection.";
      state.status = "error";
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
      } else {
        state.totalAuctions = (state.totalAuctions || 0) + 1;
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
      const { auction_id, sellerId, currentUserId, message, status } =
        action.payload;
      state.auctions = state.auctions.filter(
        (auction) => auction.id !== auction_id
      );
      state.likesAuctions = state.auctions.filter(
        (auction) => auction.id !== auction_id
      );
      state.bidsAuctions = state.auctions.filter(
        (auction) => auction.id !== auction_id
      );
      state.salesAuctions = state.auctions.filter(
        (auction) => auction.id !== auction_id
      );
      if (sellerId === currentUserId) {
        state.totalAuctions = state.totalAuctions - 1;
        state.message = message;
        state.status = status;
      }
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
    clearAuctionMessage(state) {
      state.message = null;
      state.status = null;
    },
    proccesingError(state, payload) {
      console.log("reach proccesingError: ");
      state.message = payload.message;
      state.status = payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories Cases
      .addCase(fetchCategories.pending, (state) => {
        // state.status = "pending";
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
      })
      // Create Auction Cases
      .addCase(createAuction.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.error = null;
        // You can add the new auction to the list if needed
        // state.auctions.unshift(addTimeLeft(action.payload.data));
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.status = "rejected";
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

export const createAuction = createAsyncThunk(
  "auctions/create",
  async (data, { rejectWithValue }) => {
    try {
      // Send through WebSocket
      sendThroughSocket({
        source: "create_auction",
        data,
      });

      // Return success response
      return { success: true, data };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create auction");
    }
  }
);

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

export const deleteAuction = (data) => {
  console.log("deleteAuction: ", data);
  sendThroughSocket({
    source: "delete_auction",
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
export const getTotalAuctions = (state) => state.auctions.totalAuctions;
export const getAuctionMessage = (state) => state.auctions.message;
export const getAuctionStatus = (state) => state.auctions.status;

export const {
  setSocketConnected,
  setSocketDisconnected,
  setSearchList,
  updateTime,
  clearAuctionMessage,
} = auctionsSlice.actions;

export default auctionsSlice.reducer;
