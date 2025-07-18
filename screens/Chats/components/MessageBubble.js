import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MessageBubbleMe from "./MessageBubbleMe";
import MessageBubbleFriend from "./MessageBubbleFriend";
import utils from "@/core/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  checkMessageTyping,
  cleanTypingIndicator,
} from "@/state/reducers/chatsSlice";

function formatMessageDate(dateString) {
  const msgDate = new Date(dateString); // keep as Date object

  const now = new Date();
  const today = new Date(now.toDateString()); // strips time
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const msgDay = new Date(msgDate.toDateString()); // also strip time

  if (msgDay.getTime() === today.getTime()) return "Today";
  if (msgDay.getTime() === yesterday.getTime()) return "Yesterday";

  return msgDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const MessageBubble = ({
  index,
  message,
  prevMessage,
  friend,
  connectionId,
}) => {
  // utils.log("MessageBubble: ", message);

  const [showTyping, setShowTyping] = useState(false);
  const dispatch = useDispatch();
  const messageTyping = useSelector(checkMessageTyping(connectionId));
  // console.log("messageTyping: ", messageTyping);

  useEffect(() => {
    if (index !== 0) return;
    if (messageTyping === null) {
      setShowTyping(false);
      return;
    }
    setShowTyping(true);
    const check = setInterval(() => {
      const now = new Date();
      // dateString)
      const ms = now - new Date(messageTyping);
      if (ms > 10000) {
        setShowTyping(false);
        dispatch(cleanTypingIndicator(connectionId));
      }
    }, 1000);

    return () => clearInterval(check);
  }, [messageTyping]);

  if (index === 0) {
    if (showTyping) {
      return <MessageBubbleFriend friend={friend} typing={true} />;
    }

    // Skip rendering the fake item (id -1)
    return null;
  }

  const currentDateLabel = formatMessageDate(message.created);

  let showDateLabel = false;
  if (
    !prevMessage ||
    formatMessageDate(prevMessage.created) !== currentDateLabel
  ) {
    showDateLabel = true;
  }

  return (
    <>
      {message.is_me ? (
        <MessageBubbleMe content={message.content} created={message.created} />
      ) : (
        <MessageBubbleFriend
          content={message.content}
          friend={friend}
          created={message.created}
        />
      )}

      {showDateLabel && (
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text
            style={{
              backgroundColor: "#ccc",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 10,
              color: "#333",
              fontSize: 12,
            }}
          >
            {currentDateLabel}
          </Text>
        </View>
      )}
    </>
  );
};
export default MessageBubble;

const styles = StyleSheet.create({});
