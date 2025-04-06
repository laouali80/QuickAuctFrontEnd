import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Cell from "./share-components/Cell";
import Thumbnail from "./share-components/Thumbnail";
import { formatChatTime } from "@/core/utils";

const ChatRow = ({ navigation, item }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat", item);
      }}
    >
      <Cell>
        <Thumbnail
          url={item.friend.thumbnail}
          width={76}
          height={76}
          borderRadius={76 / 2}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#202020",
              marginBottom: 4,
            }}
          >
            {item.friend.name}
          </Text>
          <Text
            style={{
              color: "#606060",
            }}
          >
            {item.preview}
            <Text style={{ color: "#909090", fontSize: 13 }}>
              {formatChatTime(item.updated)}
            </Text>
          </Text>
        </View>
      </Cell>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({});
