import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Thumbnail from "@/common_components/Thumbnail";

const MessageBubbleFriend = ({ text, friend }) => {
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
          backgroundColor: "#d0d2db",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginLeft: 8,
          minHeight: 42,
        }}
      >
        <Text
          style={{
            color: "#202020",
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default MessageBubbleFriend;

const styles = StyleSheet.create({});
