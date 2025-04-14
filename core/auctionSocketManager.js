import { createAsyncThunk } from "@reduxjs/toolkit";
import { BaseAddress } from "./api";
import utils from "./utils";

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

export const initializeAuctionSocket = createAsyncThunk(
  "auctions/connection",
  async (tokens, { dispatch, rejectWithValue }) => {
    try {
      if (socket) {
        socket.close();
      }

      socket = new WebSocket(
        `ws://${BaseAddress}/ws/auctions/?tokens=${tokens.access}`
      );

      socket.onopen = () => {
        console.log("Auction Socket connected!");
        socket.send(JSON.stringify({ source: "FetchAuctionsList" }));
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
