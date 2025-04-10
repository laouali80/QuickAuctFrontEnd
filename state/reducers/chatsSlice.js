import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest, { BaseAddress } from "@/core/api";
import { useDispatch, useSelector } from "react-redux";
import utils from "@/core/utils";
import { getTokens, updateThumbnail } from "./userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isConnected: false,
  messages: {}, // Store messages per conversation
  chatsList: [],
  messagesList: [],
};

// WebSocket instance (outside Redux)
let socket = null;

// ----------------------------------
//  Socket receive message handlers
// ----------------------------------

function responseChatsList(message, dispatch) {
  // console.log("✅ Received chatsList:", message.data);
  dispatch(chatsList(message.data));
}

function responseThumbnail(message, dispatch) {
  dispatch(updateThumbnail(message));
}

function responseMessagesList(message, dispatch) {
  dispatch(
    chatsSlice.actions.setMessagesList({
      messages: message.data.messages,
      overwrite: false,
    })
  );
}

function responseMessageSend(message, dispatch) {
  dispatch(
    chatsSlice.actions.pushMessage({
      message: message.data.message,
      overwrite: false,
    })
  );
}

// WebSocket Thunk
export const initializeChatSocket = createAsyncThunk(
  "chats/connection",
  async (tokens, { dispatch, rejectWithValue }) => {
    try {
      utils.log("Connecting WebSocket with token:", tokens);

      // const protocol = BaseAddress.startsWith("https") ? "wss" : "ws";
      socket = new WebSocket(
        `ws://${BaseAddress}/ws/chat/?tokens=${tokens.access}`
      );

      socket.onopen = () => {
        console.log("Chat Socket connected!");
        socket.send(JSON.stringify({ source: "FetchChatsList" }));
      };

      socket.onmessage = (event) => {
        // Convert data to javascript object
        const parsed = JSON.parse(event.data);

        // log the data received
        utils.log("Received from server:", event.data);

        // this is an object/dict of key -> value of function to be called
        const responses = {
          thumbnail: responseThumbnail, // this 'thumbnail' key will call the responseThumbnail function
          chatsList: responseChatsList,
          messagesList: responseMessagesList,
          message_send: responseMessageSend,
        };

        const resp = responses[parsed.source];

        if (!resp) {
          utils.log("parsed.source: " + parsed.source + " not found");
        } else {
          resp(parsed, dispatch); // ✅ Pass dispatch manually
        }
      };

      socket.onerror = (error) => {
        console.log(" WebSocket Error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      // 🚀 Auto-reconnect after 5 seconds
      // setTimeout(() => {
      //   dispatch(initializeChatSocket(tokens));
      // }, 5000);

      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const ChatSocketClose = () => (dispatch) => {
  if (socket) {
    socket.close();
    socket = null; // Clear the socket reference
    dispatch(setWebSocketDisconnected());
  }
};
// Fetch messages for a chat
export const messagesList =
  (connectionId, page = 0) =>
  (dispatch) => {
    console.log("reach.....");
    if (page === 0) {
      dispatch(
        chatsSlice.actions.setMessagesList({ messages: [], overwrite: true })
      );
    }
    socket.send(
      JSON.stringify({
        connectionId,
        page,
        source: "fetchMessagesList",
      })
    );
  };

// Send message
export const messageSend = ({ connectionId, content }) => {
  // console.log("message Send: ", { connectionId, content });

  const messageData = JSON.stringify({
    connectionId,
    content,
    source: "message_send",
  });

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(messageData);
    //   // dispatch(
    //   //   receiveMessage({
    //   //     connectionId,
    //   //     message: { chat_id: connectionId, content, sender: "me" },
    //   //   })
    //   // );
  } else {
    throw new Error("WebSocket is not connected");
  }
};

// export const chatsList =
export const uploadThumbnail = (file) => {
  // const socket = get().socket;

  socket.send(
    JSON.stringify({
      source: "thumbnail",
      base64: file.base64,
      filename: file.fileName,
    })
  );
};

// Chats Slice
const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setWebSocketConnected(state) {
      state.isConnected = true;
    },
    setWebSocketDisconnected(state) {
      state.isConnected = false;
    },
    chatsList(state, action) {
      // console.log("✅ chatsList reducer triggered with:", action.payload);
      state.chatsList = action.payload;
    },
    setMessagesList(state, action) {
      const { messages, overwrite } = action.payload;

      if (overwrite) {
        state.messagesList = messages;
      } else {
        state.messagesList = [...messages, ...(state.messagesList || [])];
      }
    },
    pushMessage(state, action) {
      const { message } = action.payload;
      state.messagesList = [message, ...(state.messagesList || [])];
    },
    receiveMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(messageList.fulfilled, (state, action) => {
  //     const { chatId, messages } = action.payload;
  //     state.messages[chatId] = messages;
  //   });
  // },
});

export const {
  setWebSocketConnected,
  setWebSocketDisconnected,
  chatsList,
  receiveMessage,
} = chatsSlice.actions;

export const getChatsList = (state) => state.chats.chatsList;
export const getMessages = (state) => state.chats.messagesList;

export default chatsSlice.reducer;
