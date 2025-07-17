import { createAsyncThunk } from "@reduxjs/toolkit";
import utils, { formatAuctionTime } from "./utils";
import { BaseAddress, SocketProtocol } from "@/constants/config";
import { getStore } from "./storeRef";

// core/socketManager.js
let socket = null;

// ----------------------------------
//  Socket receive message handlers
// ----------------------------------

function responseNewAuction(data) {
  const state = getStore().getState();
  const currentUserId = state.user.user?.userId; // adjust path if different
  const { seller } = data;
  getStore()?.dispatch({
    type: "auctions/addNewAuction",
    payload: { seller, currentUserId },
  });
}

function responseNewBid(data) {
  // console.log(data);
  getStore()?.dispatch({
    type: "auctions/updateAuction",
    payload: data,
  });
}

function responseWatcher(data) {
  // console.log(data);
  getStore()?.dispatch({
    type: "auctions/updateAuction",
    payload: data,
  });
}

function responseDeleteAuction(data) {
  const state = getStore().getState();
  const currentUserId = state.user.user?.userId; // adjust path if different
  console.log("responseDeleteAuction: ", { ...data, currentUserId });
  // getStore()?.dispatch({
  //   type: "auctions/auction_deleted",
  //   payload: { ...data, currentUserId },
  // });
}

function responseProccessingError(data) {
  const state = getStore().getState();
  const currentUserId = state.user.user?.userId; // adjust path if different
  getStore()?.dispatch({
    type: "auctions/proccesingError",
    payload: { ...data, currentUserId },
  });
}

export const addTimeLeft = (auction) => {
  return {
    ...auction,
    timeLeft: formatAuctionTime(auction.end_time),
  };
};
// WebSocket message handlers
const handleAuctionsList = (data, dispatch) => {
  // console.log('handleAuctionsList: ', data);

  const { auctions, nextPage, loaded, listType = "all" } = data;
  const processedAuctions = auctions.map(addTimeLeft);

  getStore()?.dispatch({
    type: "auctions/setAuctionsList",
    payload: {
      auctions: processedAuctions,
      nextPage,
      loaded,
      listType,
    },
  });
};

export const initializeAuctionSocket = createAsyncThunk(
  "auctions/connection",
  async (tokens, { dispatch, getState, rejectWithValue }) => {
    try {
      if (socket) {
        socket.close();
      }

      socket = new WebSocket(
        `${SocketProtocol}://${BaseAddress}/ws/auctions/?tokens=${tokens.access}`
      );

      console.log("getStore() auction: ", getStore());
      socket.onopen = () => {
        console.log("Auction Socket connected!");
        getStore().dispatch({ type: "auctions/clearAuctions" }); // clear old
        socket.send(
          JSON.stringify({
            source: "FetchAuctionsListByCategory",
            data: {
              page: 1,
              category: {
                key: 0,
                value: "All",
              },
            },
          })
        );
        // getStore()?.dispatch({ type: "auctions/setSocketConnected" });
      };

      socket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        // utils.log("received from server: ", parsed);
        const handlers = {
          search: (data) =>
            getStore()?.dispatch({
              type: "auctions/setSearchList",
              payload: data,
            }),
          // auctionsList: responseAuctionsList,
          auctionsList: handleAuctionsList,
          new_auction: responseNewAuction,
          new_bid: responseNewBid,
          watcher: responseWatcher,
          likesAuctions: (data) =>
            handleAuctionsList({ ...data, listType: "likes" }, dispatch),
          bidsAuctions: (data) =>
            handleAuctionsList({ ...data, listType: "bids" }, dispatch),
          salesAuctions: (data) =>
            handleAuctionsList({ ...data, listType: "sales" }, dispatch),
          // likesAuctions: responseLikesAuctions,
          // bidsAuctions: responseBidsAuctions,
          // salesAuctions: responseSalesAuctions,
          delete_auction: responseDeleteAuction,
          proccessing_error: responseProccessingError,
        };

        if (handlers[parsed.source]) {
          handlers[parsed.source](parsed.data);
        }
      };

      socket.onerror = () => {
        socket.close();
        socket = null;
        getStore()?.dispatch({ type: "auctions/setSocketDisconnected" });
      };

      socket.onclose = () => {
        console.log("WebSocket Disconnected");

        // getStore()?.dispatch({ type: "auctions/setSocketDisconnected" });
      };
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const AuctionSocketClose = () => (dispatch) => {
  if (socket) {
    socket.close();
    socket = null;
    getStore()?.dispatch({ type: "auctions/setSocketDisconnected" });
    // dispatch(setSocketDisconnected)
  }
};

export const sendThroughSocket = (data) => {
  console.log("auctionSocketManager: ", data);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};

export const getSocketStatus = () => socket?.readyState === WebSocket.OPEN;
