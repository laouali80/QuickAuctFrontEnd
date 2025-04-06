import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Thumbnail from "./share-components/Thumbnail";

const ChatHeader = ({ friend }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Thumbnail
        url={friend.thumbnail}
        width={30}
        height={30}
        borderRadius={30 / 2}
      />
      <Text
        style={{
          color: "#202020",
          marginLeft: 10,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {friend.name}
      </Text>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({});
