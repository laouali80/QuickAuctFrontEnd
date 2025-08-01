import { createAsyncThunk } from "@reduxjs/toolkit";
import utils, { formatAuctionTime } from "./utils";
import { BaseAddress, SocketProtocol } from "@/constants/config";
import { getStore } from "./storeRef";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "@/animation/CustomToast/ToastManager";
import { refreshSocketTokenIfNeeded } from "./refreshSocketToken";
import secure from "@/storage/secure";

// core/socketManager.js
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let auctionSocket = null;

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
      // ✅ Avoid reconnecting if already connected or connecting
      if (auctionSocket && auctionSocket.readyState === WebSocket.OPEN) {
        console.log("🟢 auction socket already open — skipping reconnect");
        return true;
      }

      // You could optionally guard against CONNECTING state too
      if (auctionSocket && auctionSocket.readyState === WebSocket.CONNECTING) {
        console.log(
          "⏳ auction socket is still connecting — skipping reconnect"
        );
        return true;
      }

      let AccessToken = WebSimuTokens
        ? WebSimuTokens.access
        : await secure.getAccessToken();

      AccessToken = await refreshSocketTokenIfNeeded(AccessToken);

      auctionSocket = new WebSocket(
        `${SocketProtocol}://${BaseAddress}/ws/auctions/?tokens=${AccessToken}`
      );

      // console.log("getStore() auction: ", getStore());
      auctionSocket.onopen = () => {
        console.log("Auction Socket connected!");

        reconnectAttempts = 0;
        getStore().dispatch({ type: "auctions/clearAuctions" }); // clear old
        auctionSocket.send(
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

      auctionSocket.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        utils.log("received from auction socket: ", parsed);
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

      auctionSocket.onerror = () => {
        auctionSocket.close();
        auctionSocket = null;
        getStore()?.dispatch({ type: "auctions/setSocketDisconnected" });
      };

      auctionSocket.onclose = (e) => {
        console.log("🔌 Auction WebSocket disconnected", e);
        console.log("auction socket closed reason", e.reason);

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          setTimeout(() => {
            dispatch(initializeAuctionSocket(tokens));
          }, Math.pow(2, reconnectAttempts) * 1000);
        } else {
          // Wait for network reconnect to retry
          const unsubscribe = NetInfo.addEventListener((state) => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if (state.isConnected) {
              console.log("📶 Network restored, retrying WebSocket");
              reconnectAttempts = 0;
              dispatch(initializeAuctionSocket(tokens));
              unsubscribe(); // cleanup listener
            }
          });
        }
      };
      return true;
    } catch (err) {
      console.error("Error initializing auction socket:", err);
      return rejectWithValue(err.message);
    }
  }
);

export const AuctionSocketClose = () => (dispatch) => {
  if (auctionSocket) {
    auctionSocket.close();
    auctionSocket = null;
    getStore()?.dispatch({ type: "auctions/setSocketDisconnected" });
    // dispatch(setSocketDisconnected)
  }
};

export const sendThroughSocket = async (data) => {
  const netState = await NetInfo.fetch();
  console.log("auctionSocketManager: ", data);

  if (!netState.isConnected || !netState.isInternetReachable) {
    console.warn("📴 Device offline. Cannot send auction sokect requests.");
    showToast({
      text: "📴 Please connect to the internet",
      duration: 2000,
      type: "error",
    });
    return;
  }

  if (auctionSocket && auctionSocket.readyState === WebSocket.OPEN) {
    auctionSocket.send(JSON.stringify(data));
  } else {
    console.warn("Auction WebSocket not open");
    showToast({
      text: "💬 Server unavailable. Please wait or try again.",
      duration: 2000,
      type: "warning",
    });
  }
};

export const getSocketStatus = () => socket?.readyState === WebSocket.OPEN;
