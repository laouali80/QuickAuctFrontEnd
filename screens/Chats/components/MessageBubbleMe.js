import { StyleSheet, Text, View } from "react-native";
import React from "react";

const MessageBubbleMe = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingRight: 16,
      }}
    >
      <View style={{ flex: 1 }} />
      <View
        style={{
          backgroundColor: "#303040",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginRight: 8,
          minHeight: 42,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubbleMe;

const styles = StyleSheet.create({});
