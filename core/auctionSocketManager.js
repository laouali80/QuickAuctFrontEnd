import { createAsyncThunk } from "@reduxjs/toolkit";
import utils from "./utils";
import { BaseAddress, DEVELOPMENT } from "@/constants/config";

// core/socketManager.js
let socket = null;

let storeRef = null; // for dispatching from socket events

export const setStore = (store) => {
  storeRef = store;
};

// ----------------------------------
//  Socket receive message handlers
// ----------------------------------

function responseAuctionsList(data) {
  // console.log("✅ Received chatsList:", message.data);
  storeRef?.dispatch({
    type: "auctions/setAuctionsList",
    payload: data,
  });
}

function responseNewAuction(data) {
  const state = storeRef.getState();
  const currentUserId = state.user.user?.userId; // adjust path if different
  const { seller } = data;
  storeRef?.dispatch({
    type: "auctions/addNewAuction",
    payload: { seller, currentUserId },
  });
}

function responseNewBid(data) {
  // console.log(data);
  storeRef?.dispatch({
    type: "auctions/auction_updated",
    payload: data,
  });
}

function responseWatcher(data) {
  // console.log(data);
  storeRef?.dispatch({
    type: "auctions/auction_updated",
    payload: data,
  });
}

function responseLikesAuctions(data) {
  // console.log(data);
  storeRef?.dispatch({
    type: "auctions/setLikesAuctions",
    payload: data,
  });
}

function responseBidsAuctions(data) {
  storeRef?.dispatch({
    type: "auctions/setBidsAuctions",
    payload: data,
  });
}

function responseSalesAuctions(data) {
  storeRef?.dispatch({
    type: "auctions/setSalesAuctions",
    payload: data,
  });
}

function responseDeleteAuction(data) {
  const state = storeRef.getState();
  const currentUserId = state.user.user?.userId; // adjust path if different
  console.log("responseDeleteAuction: ", { ...data, currentUserId });
  // storeRef?.dispatch({
  //   type: "auctions/auction_deleted",
  //   payload: { ...data, currentUserId },
  // });
}

function responseProccessingError(data){
  const state = storeRef.getState();
  const currentUserId = state.user.user?.userId; // adjust path if different
storeRef?.dispatch({
    type: "auctions/proccesingError",
    payload: { ...data, currentUserId },
  });
}

export const initializeAuctionSocket = createAsyncThunk(
  "auctions/connection",
  async (tokens, { dispatch, rejectWithValue }) => {
    try {
      if (socket) {
        socket.close();
      }

      const protocol = DEVELOPMENT ? "ws" : "wss";
      socket = new WebSocket(
        `${protocol}://${BaseAddress}/ws/auctions/?tokens=${tokens.access}`
      );

      socket.onopen = () => {
        console.log("Auction Socket connected!");
        storeRef.dispatch({ type: "auctions/clearAuctions" }); // clear old
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
        // storeRef?.dispatch({ type: "auctions/setSocketConnected" });
      };

      socket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        utils.log("received from server: ", parsed);
        const handlers = {
          search: (data) =>
            storeRef?.dispatch({
              type: "auctions/setSearchList",
              payload: data,
            }),
          auctionsList: responseAuctionsList,
          new_auction: responseNewAuction,
          new_bid: responseNewBid,
          watcher: responseWatcher,
          likesAuctions: responseLikesAuctions,
          bidsAuctions: responseBidsAuctions,
          salesAuctions: responseSalesAuctions,
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
        storeRef?.dispatch({ type: "auctions/setSocketDisconnected" });
      };

      socket.onclose = () => {
        console.log("WebSocket Disconnected");

        // storeRef?.dispatch({ type: "auctions/setSocketDisconnected" });
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
    storeRef?.dispatch({ type: "auctions/setSocketDisconnected" });
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
