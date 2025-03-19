import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Empty = ({ icon, message, centered = true }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: centered ? "center" : "flex-start",
        alignItems: "center",
        paddingVertical: 120,
      }}
    >
      {icon}
      <Text
        style={{
          color: "#c3c3c3",
          fontSize: 16,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({});
