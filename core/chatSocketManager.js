let chatSocket = null;

export const connectChatSocket = (accessToken, onMessageCallback) => {
  if (chatSocket) chatSocket.close();

  chatSocket = new WebSocket(
    `ws://${BaseAddress}/ws/chat/?tokens=${accessToken}`
  );

  chatSocket.onopen = () => {
    console.log("🔌 Chat WebSocket connected");
  };

  chatSocket.onmessage = (event) => {
    const parsed = JSON.parse(event.data);
    onMessageCallback?.(parsed);
  };

  chatSocket.onerror = (err) => {
    console.error("❌ Chat WebSocket error:", err);
  };

  chatSocket.onclose = () => {
    console.log("🔌 Chat WebSocket disconnected");
  };
};

export const sendChatMessage = (data) => {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify(data));
  } else {
    console.warn("Chat WebSocket not open");
  }
};

export const closeChatSocket = () => {
  if (chatSocket) {
    chatSocket.close();
    chatSocket = null;
  }
};
