import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";

const MessageBubbleMe = ({ content, created }) => {
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
          backgroundColor: "#259e47",
          // backgroundColor: COLORS.primary,
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginRight: 8,
          minHeight: 42,
          flexDirection: "row",
          alignItems: "end",
        }}
      >
        <Text
          style={{
            color: "white",
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
    </View>
  );
};

export default MessageBubbleMe;

const styles = StyleSheet.create({});
