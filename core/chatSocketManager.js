import { BaseAddress, SocketProtocol } from "@/constants/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import utils from "./utils";
import { getStore } from "./storeRef";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "@/animation/CustomToast/ToastManager";

// WebSocket instance (outside Redux)
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let chatSocket = null;

// ----------------------------------
//  Socket receive message handlers

function responseConversationsList(data, dispatch) {
  // console.log("✅ Received setConversations from new setup:", data);

  getStore()?.dispatch({
    type: "chats/setConversations",
    payload: {
      ...data,
    },
  });
  // dispatch(chatsSlice.actions.setConversations(message.data));
}

function responseChatMessages(data, dispatch) {
  // console.log("responseChatMessagess: ", data);
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
      ...data,
      mode: data.currentPage === 1 ? "replace" : "prepend", // or use your own logic
    },
  });

  // dispatch(
  //   chatsSlice.actions.setChatMessages({
  //     ...data.data,
  //     mode: data.data.currentPage === 1 ? "replace" : "prepend" // or use your own logic
  //     })
  // );
}

function responseMessageSend(data) {
  // console.log("responseMessageSend: ", data);
  // addMessageToConversation
  // const username = message.data.friend.username;
  // const currentState = getState();

  // Update chat preview and move to top
  // dispatch(
  //   chatsSlice.actions.updateChatPreview({
  //     username,
  //     preview: message.data.message.content,
  //     timestamp: message.data.message.created,
  //   })
  // );

  // Update conversation

  getStore()?.dispatch({
    type: "chats/addMessageToConversation",
    payload: {
      connectionId: data.connectionId,
      message: data.message,
      isNew: true,
    },
  });

  // // Only add to messagesList if it's the active chat
  // if (username === currentState.chats.activeChatUsername) {
  //   dispatch(
  //     chatsSlice.actions.pushMessage({
  //       message: message.data.message,
  //       // overwrite: false,
  //     })
  //   );

  //   // Reset pagination state for this chat
  //   dispatch(
  //     chatsSlice.actions.setMessagesNext({
  //       messagesNext: null,
  //     })
  //   );
  // }
}

const responseTypingIndicator = (data) => {
  // console.log("responseTypingIndicator: ", data);
  const { connectionId, username } = data;
  const state = getStore().getState();
  const activeChatId = state.chats?.activeChatId; // adjust path if different

  // const state = getState();

  // Only show typing for active chat
  if (connectionId === activeChatId) {
    getStore()?.dispatch({
      type: "chats/setTypingIndicator",
      payload: {
        connectionId,
        username,
        timestamp: new Date().toString(),
      },
    });
  }
};

function responseNewConnection(data, dispatch) {
  // console.log("responseNewConnection: ", data);
  // console.log("responseNewConnection: ", data.data);

  getStore()?.dispatch({
    type: "chats/addNewConnection",
    payload: {
      ...data,
    },
  });

  getStore()?.dispatch({
    type: "chats/addMessageToConversation",
    payload: {
      connectionId: data.connection.connectionId,
      message: data.message,
      isNew: true,
    },
  });

  // dispatch(chatsSlice.actions.addNewConnection(message.data));
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
      return new Promise((resolve, reject) => {
        chatSocket.onopen = () => {
          console.log("🔌 Chat WebSocket connected");
          reconnectAttempts = 0;
          // getStore().dispatch({ type: "auctions/clearConversations" }); // clear old
          getStore()?.dispatch({ type: "chats/setChatWebSocketConnected" });
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
              typingIndicator: responseTypingIndicator,
              message_send: responseMessageSend,
              new_connection: responseNewConnection,
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
          // dispatch(
          //   chatsSlice.actions.setConnectionStatus({
          //     isConnected: false,
          //     error: error.message,
          //   })
          // );
          reject(error);
        };

        chatSocket.onclose = () => {
          console.log("🔌 Chat WebSocket disconnected");

          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(() => {
              dispatch(initializeChatSocket(tokens));
            }, Math.pow(2, reconnectAttempts) * 1000);
          } else {
            // Wait for network reconnect to retry
            const unsubscribe = NetInfo.addEventListener((state) => {
              console.log("Connection type", state.type);
              console.log("Is connected?", state.isConnected);
              if (state.isConnected) {
                console.log("📶 Network restored, retrying WebSocket");
                reconnectAttempts = 0;
                dispatch(initializeChatSocket(tokens));
                unsubscribe(); // cleanup listener
              }
            });
          }
        };
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendChatDataThroughSocket = async (data) => {
  const netState = await NetInfo.fetch();

  console.log("auctionSocketManager: ", data);
  if (!netState.isConnected || !netState.isInternetReachable) {
    console.warn("📴 Device offline. Cannot send message.");

    showToast({
      text: "📴 Please connect to the internet",
      duration: 2000,
      type: "error",
    });
    return;
  }

  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify(data));
  } else {
    console.warn("Chat WebSocket not open");
    showToast({
      text: "💬 Server unavailable. Please wait or try again.",
      duration: 2000,
      type: "warning",
    });
  }
};

export const ChatSocketClose = () => (dispatch) => {
  if (chatSocket) {
    chatSocket.close();
    chatSocket = null;
    // Clear the socket reference
    // getStore()?.dispatch({ type: "chats/setWebSocketDisconnected" });
  }
};
