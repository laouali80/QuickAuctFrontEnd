import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MessageBubbleMe from "./MessageBubbleMe";
import MessageBubbleFriend from "./MessageBubbleFriend";
import utils from "@/core/utils";

const MessageBubble = ({ index, message, friend }) => {
  utils.log("MessageBubble: ", message);
  return message.is_me ? (
    <MessageBubbleMe content={message.content} />
  ) : (
    <MessageBubbleFriend content={message.content} friend={friend} />
  );
};
export default MessageBubble;

const styles = StyleSheet.create({});
