// store/auctionsSlice.js
import apiRequest from "@/api/axiosInstance";
import { sendThroughSocket } from "@/core/auctionSocketManager";
import utils, { formatAuctionTime } from "@/core/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Current view's auctions (cleared when switching views)
  // auctions: {
  //   // auctionId: {
  //   //   id, title, description, current_bid, end_time, seller, etc.
  //   //   timeLeft: formatted_time,
  //   //   lastUpdated: timestamp,
  //   //   status: 'active' | 'ending' | 'ended' | 'sold'
  //   // }
  // },

  // Organized lists for different views
  auctions: {
    all: { auctions: {
      // auctionId: {
    //   id, title, description, current_bid, end_time, seller, etc.
    //   timeLeft: formatted_time,
    //   lastUpdated: timestamp,
    //   status: 'active' | 'ending' | 'ended' | 'sold'
    // }
    }, pagination: { next: null, hasMore: true } },
    likes: { auctions: {}, pagination: { next: null, hasMore: true } },
    bids: { auctions: {}, pagination: { next: null, hasMore: true } },
    sales: { auctions: {}, pagination: { next: null, hasMore: true } },
    ongoing: { auctions: {}, pagination: { next: null, hasMore: true } },
    closed: { auctions: {}, pagination: { next: null, hasMore: true } },
    completed: { auctions: {}, pagination: { next: null, hasMore: true } },
    search: { auctions: {}, query: '' }
  },


  

  // Connection state
  isConnected: false,
  searchList: null,
  newAuctions: 0,
  NextPage: null,
  categories: [],
  error: null,
  totalAuctions: 0,
  message: null,
  status: null,
  
  // Pagination for current view
  pagination: { next: null, hasMore: true },
};

const addTimeLeft = (auction) => {
  return {
    ...auction,
    timeLeft: formatAuctionTime(auction.end_time),
    lastUpdated: Date.now(),
  };
};

const updateAuctionTime = (auction) => {
  
  return addTimeLeft(auction);
};

// const updAuctTime = (auction) => {
//   return {
//     ...auction,
//     timeLeft: formatAuctionTime(auction.end_time),
//   };
// };

const auctionsSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {
    setSocketConnected(state) {
      state.isConnected = true;
    },
    setSocketDisconnected(state) {
      state.isConnected = false;
      // state.message = "Network disconnected. Please check your connection.";
      // state.status = "error";
    },
    setSearchList(state, action) {
      // utils.log("setSearchList payload: ", action.payload);
      state.searchList = action.payload;
    },

    setAuctionsList(state, action) {
      // console.log("payload: ",action.payload)
      const { auctions, nextPage, loaded, listType = 'all' } = action.payload;
      
      // Get the target list
      const targetList = state.auctions[listType];
      if (!targetList) {
        console.warn(`List type '${listType}' not found in state.auctions`);
        return;
      }
      
      // Convert new auctions to objects with timeLeft
      const newAuctionsWithTime = {};
      auctions.forEach(auction => {
        newAuctionsWithTime[auction.id] = addTimeLeft(auction);
      });
      
      // Merge with existing auctions based on loaded flag
      if (loaded) {
        // Append new auctions to existing ones (for pagination)
        // New auctions will override existing ones if they have the same ID
        targetList.auctions = { ...targetList.auctions, ...newAuctionsWithTime };
      } else {
        // Prepend new auctions to existing ones (for refresh/new data)
        // Existing auctions will override new ones if they have the same ID
        targetList.auctions = { ...newAuctionsWithTime, ...targetList.auctions };
      }
      
      // Update pagination for the specific list
      targetList.pagination = { next: nextPage, hasMore: !!nextPage };
      
      // Also update the global NextPage for backward compatibility
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
    updateTime(state, action) {
      const listType = action.payload?.listType || 'all';
      
      // Update time only for the specified list type
      const list = state.auctions[listType];
      if (list && list.auctions) {
        Object.keys(list.auctions).forEach(auctionId => {
          const auction = list.auctions[auctionId];
          if (auction && auction?.timeLeft !== "Completed") {
            list.auctions[auctionId] = updateAuctionTime(auction);
          }
        });
      }
    },
    // updateTime(state) {
    //   // state.auctions = [
    //   //   ...state.auctions
    //   //     .filter((auction) => auction.timeLeft !== "Completed")
    //   //     .map(updAuctTime),
    //   // ];

    //   state.auctions = state.auctions.map((auction) =>
    //     auction.timeLeft === "Completed" ? auction : updAuctTime(auction)
    //   );
    // },
    // auction_deleted(state, action) {
    //   const { auction_id, sellerId, currentUserId, message, status } =
    //     action.payload;
    //   state.auctions = state.auctions.filter(
    //     (auction) => auction.id !== auction_id
    //   );
    //   state.likesAuctions = state.auctions.filter(
    //     (auction) => auction.id !== auction_id
    //   );
    //   state.bidsAuctions = state.auctions.filter(
    //     (auction) => auction.id !== auction_id
    //   );
    //   state.salesAuctions = state.auctions.filter(
    //     (auction) => auction.id !== auction_id
    //   );
    //   if (sellerId === currentUserId) {
    //     state.totalAuctions = state.totalAuctions - 1;
    //     state.message = message;
    //     state.status = status;
    //   }
    // },
    updateAuction(state, action) {
      const updatedAuction = action.payload;
      
      // Update the auction in all list types where it exists
      Object.keys(state.auctions).forEach(listType => {
        const list = state.auctions[listType];
        if (list && list.auctions && list.auctions[updatedAuction.id]) {
          // Update the auction with new data and recalculate time
          list.auctions[updatedAuction.id] = updateAuctionTime(updatedAuction);
        }
      });
    },
    clearAuctions(state, action) {
      const listType = action.payload?.listType || 'all';
      
      // Clear specific list type or all lists
      if (listType === 'all') {
        // Clear all list types
        Object.keys(state.auctions).forEach(key => {
          if (state.auctions[key].auctions) {
            state.auctions[key].auctions = {};
            state.auctions[key].pagination = { next: null, hasMore: true };
          }
        });
      } else {
        // Clear specific list type
        if (state.auctions[listType]) {
          state.auctions[listType].auctions = {};
          state.auctions[listType].pagination = { next: null, hasMore: true };
        }
      }
      
      // Reset global pagination for backward compatibility
      state.pagination = { next: null, hasMore: true };
      state.NextPage = null;
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
      // console.log("reach proccesingError: ");
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

// Helper function to manually update an auction (useful for optimistic updates)
export const updateAuctionOptimistically = (auctionData) => (dispatch) => {
  dispatch(auctionsSlice.actions.updateAuction(auctionData));
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
  dispatch(auctionsSlice.actions.clearAuctions({ listType: 'all' }));

  sendThroughSocket({
    source: "FetchAuctionsList",
    data: { page: 1 },
  });
};

// export const loadMore = (data) => {
//   sendThroughSocket({
//     source: "load_more",
//     data,
//   });
// };

export const loadMoreAuctions = (data) => (dispatch) => {
  console.log("Request data: ",data)
  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions({ listType: data.listType }));

  
  const sources = {
    all: "FetchAuctionsListByCategory",
    likes: "likesAuctions",
    bids: "bidsAuctions",
    sales: "salesAuctions"
  };
  
  sendThroughSocket({
    source: sources[data.listType],
    data: data
  });
};

export const fetchLikesAuctions = (data) => (dispatch) => {
  console.log("fetchLikesAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions({ listType: 'likes' }));

  sendThroughSocket({
    source: "likesAuctions",
    data,
  });
};

export const fetchBidsAuctions = (data) => (dispatch) => {
  console.log("fetchBidsAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions({ listType: 'bids' }));

  sendThroughSocket({
    source: "bidsAuctions",
    data,
  });
};

export const fetchSalesAuctions = (data) => (dispatch) => {
  // console.log("fetchSalesAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions({ listType: 'sales' }));

  sendThroughSocket({
    source: "salesAuctions",
    data,
  });
};

export const fetchAuctions = (data) => (dispatch) => {
  // console.log("fetchSalesAuctions: ", data);

  if (data.page === 1) dispatch(auctionsSlice.actions.clearAuctions({ listType: 'all' }));

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
// export const getAuctionsList = (state) => state.auctions.auctions;
export const getAuctionsList = (listType = 'all') => (state) => {
  const list = state.auctions.auctions[listType];
  return list ? Object.values(list.auctions) : [];
};

// export const getSaveAuctionsList = (listType = 'all') => (state) => {
//   const list = state.auctions.auctions[listType];
//   return list ? list.auctions : {};
// };

export const selectAuction = (id, listType = 'all') => (state) => {
  const list = state.auctions.auctions[listType];
  return list ? list.auctions[id] : undefined;
};

export const getNewAuctions = (state) => state.auctions.newAuctions;
export const getAuction = (id, listType = 'all') => (state) => {
  const list = state.auctions.auctions[listType];
  return list ? list.auctions[id] : undefined;
};
export const getAuctNextPage = (listType = 'all') => (state) => {
  const list = state.auctions.auctions[listType];
  return list ? list.pagination.next : null;
};
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
  setAuctionsList,
  updateTime,
  updateAuction,
  clearAuctions,
  clearAuctionMessage,
} = auctionsSlice.actions;

export default auctionsSlice.reducer;
