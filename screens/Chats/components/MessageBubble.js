import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MessageBubbleMe from "./MessageBubbleMe";
import MessageBubbleFriend from "./MessageBubbleFriend";

const MessageBubble = ({ index, message, friend }) => {
  return message.is_me ? (
    <MessageBubbleMe text={message.text} />
  ) : (
    <MessageBubbleFriend text={message.text} friend={friend} />
  );
};
export default MessageBubble;

const styles = StyleSheet.create({});
