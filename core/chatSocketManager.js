import { BaseAddress, SocketProtocol } from "@/constants/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import utils from "./utils";
import { getStore } from "./storeRef";

// WebSocket instance (outside Redux)
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let chatSocket = null;

// ----------------------------------
//  Socket receive message handlers

function responseConversationsList(data, dispatch) {
  console.log("✅ Received setConversations from new setup:", data);

  getStore()?.dispatch({
    type: "chats/setConversations",
    payload: {
      ...data,
    },
  });
  // dispatch(chatsSlice.actions.setConversations(message.data));
}

function responseChatMessages(data, dispatch) {
  console.log("responseChatMessagess: ", data.data);
  // dispatch(
  //   chatsSlice.actions.setChatMessages({
  //     messages: message.data.messages,
  //     messagesNext: message.data.next,
  //     overwrite: false,
  //   })
  // );

  getStore()?.dispatch({
    type: "chats/setChatMessages",
    payload: {
      ...data.data,
      mode: data.data.currentPage === 1 ? "replace" : "prepend", // or use your own logic
    },
  });

  // dispatch(
  //   chatsSlice.actions.setChatMessages({
  //     ...data.data,
  //     mode: data.data.currentPage === 1 ? "replace" : "prepend" // or use your own logic
  //     })
  // );
}

// ----------------------------------
// WebSocket Thunk with improved error handling and reconnection
// ----------------------------------
export const initializeChatSocket = createAsyncThunk(
  "chats/initializeSocket",
  async (tokens, { dispatch, getState, rejectWithValue }) => {
    try {
      chatSocket = new WebSocket(
        `${SocketProtocol}://${BaseAddress}/ws/chat/?tokens=${tokens.access}`
      );
      console.log("getStore(): ", getStore());
      return new Promise((resolve, reject) => {
        chatSocket.onopen = () => {
          console.log("🔌 Chat WebSocket connected");
          reconnectAttempts = 0;
          // getStore().dispatch({ type: "auctions/clearConversations" }); // clear old
          getStore()?.dispatch({ type: "chats/setWebSocketConnected" });
          // getStore()?.dispatch({
          //   type: "chats/setConnectionStatus",
          //   payload: { isConnected: true, error: null },
          // });
          chatSocket.send(
            JSON.stringify({
              source: "fetchConversationsList",
              data: {
                page: 1,
              },
            })
          );
          resolve(true);
        };

        chatSocket.onmessage = (event) => {
          try {
            // log the data received
            // utils.log("Received from server:", event.data);

            const parsed = JSON.parse(event.data);
            const handlers = {
              // thumbnail: responseThumbnail, // this 'thumbnail' key will call the responseThumbnail function
              conversationsList: responseConversationsList,
              fetchChatMessages: responseChatMessages,
              // message_typing: (message) =>
              //   responseMessageTyping(message, dispatch, getState),
              // message_send: (message) =>
              //   responseMessageSend(message, dispatch, getState),

              // chatsList: handleChatsList,
              // messagesList: handleMessagesList,
              // message_send: handleMessageSend,
              // message_typing: handleMessageTyping
            };

            // const handler = handlers[parsed.source];
            // if (handler) {
            //   handler(parsed, dispatch, getState);
            // }

            if (handlers[parsed.source]) {
              handlers[parsed.source](parsed.data, dispatch);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        chatSocket.onerror = (error) => {
          console.error("❌ Chat WebSocket error:", error);
          //
          dispatch(
            chatsSlice.actions.setConnectionStatus({
              isConnected: false,
              error: error.message,
            })
          );
          reject(error);
        };

        chatSocket.onclose = () => {
          console.log("🔌 Chat WebSocket disconnected");
          dispatch(
            chatsSlice.actions.setConnectionStatus({
              isConnected: false,
              error: null,
            })
          );

          //       // 🚀 Auto-reconnect after 5 seconds
          //       // setTimeout(() => {
          //       //   dispatch(initializeChatSocket(tokens));
          //       // }, 5000);

          // Auto-reconnect logic
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(() => {
              dispatch(initializeChatSocket(tokens));
            }, Math.pow(2, reconnectAttempts) * 1000); // Exponential backoff
          }
        };
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendChatDataThroughSocket = (data) => {
  console.log("auctionSocketManager: ", data);
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify(data));
  } else {
    console.warn("Chat WebSocket not open");
  }
};

export const ChatSocketClose = () => (dispatch) => {
  if (chatSocket) {
    chatSocket.close();
    chatSocket = null;
    // Clear the socket reference
    getStore()?.dispatch({ type: "chats/setWebSocketDisconnected" });
  }
};
