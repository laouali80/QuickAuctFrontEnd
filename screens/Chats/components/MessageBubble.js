import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MessageBubbleMe from "./MessageBubbleMe";
import MessageBubbleFriend from "./MessageBubbleFriend";
import utils from "@/core/utils";
import { useSelector } from "react-redux";
import { checkMessageTyping } from "@/state/reducers/chatsSlice";

const MessageBubble = ({ index, message, friend, connectionId }) => {
  // utils.log("MessageBubble: ", message);

  const [showTyping, setShowTyping] = useState(false);

  const messageTyping = useSelector(checkMessageTyping(connectionId));
  // console.log(messageTyping);

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
  return message.is_me ? (
    <MessageBubbleMe content={message.content} />
  ) : (
    <MessageBubbleFriend content={message.content} friend={friend} />
  );
};
export default MessageBubble;

const styles = StyleSheet.create({});
