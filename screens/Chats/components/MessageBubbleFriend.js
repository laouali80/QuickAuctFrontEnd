import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Thumbnail from "@/common_components/Thumbnail";
import MessageTypingAnimation from "./MessageTypingAnimation";
import { COLORS } from "@/constants/COLORS";

const MessageBubbleFriend = ({
  content = "",
  friend,
  typing = false,
  created,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingLeft: 16,
      }}
    >
      <Thumbnail
        url={friend.Thumbnail}
        width={42}
        height={42}
        borderRadius={42 / 2}
      />
      <View
        style={{
          backgroundColor: "#f5f4f8",
          // backgroundColor: COLORS.silverIcon,
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginLeft: 8,
          minHeight: 42,
        }}
      >
        {typing ? (
          <View style={{ flexDirection: "row" }}>
            <MessageTypingAnimation offset={0} />
            <MessageTypingAnimation offset={1} />
            <MessageTypingAnimation offset={2} />
          </View>
        ) : content.length > 0 ? (
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#202020",
                fontSize: 16,
                lineHeight: 18,
              }}
            >
              {content}
            </Text>
            <Text style={{ marginLeft: 10 }}>
              {new Date(created).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        ) : // </View>
        null}
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default MessageBubbleFriend;

const styles = StyleSheet.create({});
