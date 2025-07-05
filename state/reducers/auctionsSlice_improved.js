import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseAddress, DEVELOPMENT } from "@/constants/config";
import utils, { formatAuctionTime } from "@/core/utils";

// Improved initial state structure
const initialState = {
  // Connection state
  isConnected: false,
  connectionError: null,
  
  // Auctions organized by type and indexed by ID
  auctions: {
    // auctionId: {
    //   id, title, description, current_bid, end_time, seller, etc.
    //   timeLeft: formatted_time,
    //   lastUpdated: timestamp,
    //   status: 'active' | 'ending' | 'ended' | 'sold'
    // }
  },
  
  // Organized lists for different views
  lists: {
    all: { ids: [], pagination: { next: null, hasMore: true } },
    likes: { ids: [], pagination: { next: null, hasMore: true } },
    bids: { ids: [], pagination: { next: null, hasMore: true } },
    sales: { ids: [], pagination: { next: null, hasMore: true } },
    search: { ids: [], query: '' }
  },
  
  // User activity tracking
  userActivity: {
    watchedAuctions: new Set(),
    bidHistory: [],
    likes: new Set()
  },
  
  // Real-time updates
  realTimeUpdates: {
    newAuctions: 0,
    newBids: 0,
    endingAuctions: []
  },
  
  // Categories
  categories: [],
  
  // Loading states
  loading: {
    auctions: false,
    categories: false,
    search: false
  },
  
  // Error handling
  errors: {
    auctions: null,
    categories: null,
    search: null
  }
};

// WebSocket instance (outside Redux)
let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Utility functions
const addTimeLeft = (auction) => ({
  ...auction,
  timeLeft: formatAuctionTime(auction.end_time),
  lastUpdated: Date.now()
});

const updateAuctionTime = (auction) => {
  if (auction.timeLeft === "Completed") return auction;
  return addTimeLeft(auction);
};

const deduplicateAuctions = (auctions) => {
  const unique = [];
  const seenIds = new Set();
  
  for (const auction of auctions) {
    if (!seenIds.has(auction.id)) {
      seenIds.add(auction.id);
      unique.push(auction);
    }
  }
  
  return unique;
};

const updateAuctionInState = (state, auction) => {
  const updatedAuction = updateAuctionTime(auction);
  state.auctions[auction.id] = updatedAuction;
  
  // Update in all lists that contain this auction
  Object.keys(state.lists).forEach(listKey => {
    const list = state.lists[listKey];
    if (list.ids.includes(auction.id)) {
      // Update the auction in the list
      const index = list.ids.indexOf(auction.id);
      if (index !== -1) {
        // Trigger re-render by updating the array
        list.ids = [...list.ids];
      }
    }
  });
};

// WebSocket message handlers
const handleAuctionsList = (data, dispatch) => {
  const { auctions, nextPage, loaded, listType = 'all' } = data;
  const processedAuctions = auctions.map(addTimeLeft);
  
  dispatch(auctionsSlice.actions.updateAuctionsList({
    auctions: processedAuctions,
    nextPage,
    loaded,
    listType
  }));
};

const handleNewAuction = (data, dispatch, getState) => {
  const state = getState();
  const { seller } = data;
  const currentUserId = state.user.user?.userId;
  
  if (seller?.userId && seller.userId !== currentUserId) {
    dispatch(auctionsSlice.actions.incrementNewAuctions());
  }
  
  dispatch(auctionsSlice.actions.addAuction(data));
};

const handleNewBid = (data, dispatch) => {
  dispatch(auctionsSlice.actions.updateAuction(data));
  dispatch(auctionsSlice.actions.incrementNewBids());
};

const handleSearchResults = (data, dispatch) => {
  const { auctions, query } = data;
  const processedAuctions = auctions.map(addTimeLeft);
  
  dispatch(auctionsSlice.actions.setSearchResults({
    auctions: processedAuctions,
    query
  }));
};

// WebSocket Thunk with improved error handling
export const initializeAuctionSocket = createAsyncThunk(
  "auctions/initializeSocket",
  async (tokens, { dispatch, getState, rejectWithValue }) => {
    try {
      const protocol = DEVELOPMENT ? "ws" : "wss";
      socket = new WebSocket(`${protocol}://${BaseAddress}/ws/auctions/?tokens=${tokens.access}`);
      
      return new Promise((resolve, reject) => {
        socket.onopen = () => {
          console.log("Auction Socket connected!");
          reconnectAttempts = 0;
          dispatch(auctionsSlice.actions.setConnectionStatus({ isConnected: true, error: null }));
          
          // Load initial auctions
          socket.send(JSON.stringify({
            source: "FetchAuctionsListByCategory",
            data: {
              page: 1,
              category: { key: 0, value: "All" }
            }
          }));
          
          resolve(true);
        };
        
        socket.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            const handlers = {
              auctionsList: handleAuctionsList,
              new_auction: handleNewAuction,
              new_bid: handleNewBid,
              search: handleSearchResults,
              likesAuctions: (data) => handleAuctionsList({ ...data, listType: 'likes' }, dispatch),
              bidsAuctions: (data) => handleAuctionsList({ ...data, listType: 'bids' }, dispatch),
              salesAuctions: (data) => handleAuctionsList({ ...data, listType: 'sales' }, dispatch)
            };
            
            const handler = handlers[parsed.source];
            if (handler) {
              handler(parsed.data, dispatch, getState);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };
        
        socket.onerror = (error) => {
          console.error("Auction WebSocket Error:", error);
          dispatch(auctionsSlice.actions.setConnectionStatus({ 
            isConnected: false, 
            error: error.message 
          }));
          reject(error);
        };
        
        socket.onclose = () => {
          console.log("Auction WebSocket Disconnected");
          dispatch(auctionsSlice.actions.setConnectionStatus({ 
            isConnected: false, 
            error: null 
          }));
          
          // Auto-reconnect logic
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(() => {
              dispatch(initializeAuctionSocket(tokens));
            }, Math.pow(2, reconnectAttempts) * 1000);
          }
        };
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Improved action creators
export const searchAuctions = (query) => (dispatch) => {
  if (!query) {
    dispatch(auctionsSlice.actions.clearSearch());
    return;
  }
  
  dispatch(auctionsSlice.actions.setLoading({ search: true }));
  
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      source: "search",
      query
    }));
  }
};

export const loadMoreAuctions = (listType = 'all', page) => (dispatch) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }
  
  const sources = {
    all: "FetchAuctionsListByCategory",
    likes: "likesAuctions",
    bids: "bidsAuctions",
    sales: "salesAuctions"
  };
  
  socket.send(JSON.stringify({
    source: sources[listType],
    data: { page, listType }
  }));
};

export const placeBid = (data) => (dispatch) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    // Queue for offline or show error
    return;
  }
  
  socket.send(JSON.stringify({
    source: "place_bid",
    data
  }));
};

export const watchAuction = (auctionId) => (dispatch, getState) => {
  const state = getState();
  const isWatched = state.auctions.userActivity.watchedAuctions.has(auctionId);
  
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      source: "watch_auction",
      data: { auctionId, action: isWatched ? 'unwatch' : 'watch' }
    }));
  }
  
  dispatch(auctionsSlice.actions.toggleWatchedAuction(auctionId));
};

// Improved slice with better state management
const auctionsSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {
    setConnectionStatus(state, action) {
      const { isConnected, error } = action.payload;
      state.isConnected = isConnected;
      state.connectionError = error;
    },
    
    setLoading(state, action) {
      state.loading = { ...state.loading, ...action.payload };
    },
    
    setError(state, action) {
      const { type, error } = action.payload;
      state.errors[type] = error;
    },
    
    updateAuctionsList(state, action) {
      const { auctions, nextPage, loaded, listType } = action.payload;
      
      // Add auctions to the main auctions object
      auctions.forEach(auction => {
        state.auctions[auction.id] = auction;
      });
      
      // Update the specific list
      const list = state.lists[listType];
      const existingIds = new Set(list.ids);
      
      if (loaded) {
        // Append to existing list
        auctions.forEach(auction => {
          if (!existingIds.has(auction.id)) {
            list.ids.push(auction.id);
          }
        });
      } else {
        // Prepend to existing list
        const newIds = auctions.map(a => a.id).filter(id => !existingIds.has(id));
        list.ids = [...newIds, ...list.ids];
      }
      
      list.pagination = { next: nextPage, hasMore: !!nextPage };
    },
    
    addAuction(state, action) {
      const auction = addTimeLeft(action.payload);
      state.auctions[auction.id] = auction;
      
      // Add to all list
      if (!state.lists.all.ids.includes(auction.id)) {
        state.lists.all.ids.unshift(auction.id);
      }
    },
    
    updateAuction(state, action) {
      const auction = action.payload;
      updateAuctionInState(state, auction);
    },
    
    removeAuction(state, action) {
      const auctionId = action.payload;
      delete state.auctions[auctionId];
      
      // Remove from all lists
      Object.keys(state.lists).forEach(listKey => {
        const list = state.lists[listKey];
        list.ids = list.ids.filter(id => id !== auctionId);
      });
    },
    
    setSearchResults(state, action) {
      const { auctions, query } = action.payload;
      
      // Add auctions to main store
      auctions.forEach(auction => {
        state.auctions[auction.id] = auction;
      });
      
      // Update search list
      state.lists.search.ids = auctions.map(a => a.id);
      state.lists.search.query = query;
      state.loading.search = false;
    },
    
    clearSearch(state) {
      state.lists.search.ids = [];
      state.lists.search.query = '';
      state.loading.search = false;
    },
    
    incrementNewAuctions(state) {
      state.realTimeUpdates.newAuctions += 1;
    },
    
    incrementNewBids(state) {
      state.realTimeUpdates.newBids += 1;
    },
    
    clearNotifications(state) {
      state.realTimeUpdates.newAuctions = 0;
      state.realTimeUpdates.newBids = 0;
    },
    
    toggleWatchedAuction(state, action) {
      const auctionId = action.payload;
      if (state.userActivity.watchedAuctions.has(auctionId)) {
        state.userActivity.watchedAuctions.delete(auctionId);
      } else {
        state.userActivity.watchedAuctions.add(auctionId);
      }
    },
    
    updateTime(state) {
      // Only update auctions that are still active
      Object.keys(state.auctions).forEach(auctionId => {
        const auction = state.auctions[auctionId];
        if (auction.timeLeft !== "Completed") {
          state.auctions[auctionId] = updateAuctionTime(auction);
        }
      });
    },
    
    setCategories(state, action) {
      state.categories = action.payload;
      state.loading.categories = false;
    },
    
    clearAuctions(state) {
      state.auctions = {};
      Object.keys(state.lists).forEach(key => {
        state.lists[key].ids = [];
        state.lists[key].pagination = { next: null, hasMore: true };
      });
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
        state.errors.categories = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.loading.categories = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.errors.categories = action.payload;
      });
  }
});

// Async thunks
export const fetchCategories = createAsyncThunk(
  "auctions/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("auctions/categories/");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Improved selectors with memoization
export const selectIsConnected = (state) => state.auctions.isConnected;
export const selectConnectionError = (state) => state.auctions.connectionError;
export const selectAuctionsList = (listType = 'all') => (state) => {
  const list = state.auctions.lists[listType];
  return list.ids.map(id => state.auctions.auctions[id]).filter(Boolean);
};
export const selectAuction = (id) => (state) => state.auctions.auctions[id];
export const selectCategories = (state) => state.auctions.categories;
export const selectLoading = (type) => (state) => state.auctions.loading[type];
export const selectError = (type) => (state) => state.auctions.errors[type];
export const selectNewAuctions = (state) => state.auctions.realTimeUpdates.newAuctions;
export const selectNewBids = (state) => state.auctions.realTimeUpdates.newBids;
export const selectPagination = (listType) => (state) => state.auctions.lists[listType].pagination;
export const selectIsWatched = (auctionId) => (state) => 
  state.auctions.userActivity.watchedAuctions.has(auctionId);

export const {
  setConnectionStatus,
  setLoading,
  setError,
  updateAuctionsList,
  addAuction,
  updateAuction,
  removeAuction,
  setSearchResults,
  clearSearch,
  incrementNewAuctions,
  incrementNewBids,
  clearNotifications,
  toggleWatchedAuction,
  updateTime,
  setCategories,
  clearAuctions
} = auctionsSlice.actions;

export default auctionsSlice.reducer; 