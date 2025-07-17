import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Cell from "../../../common_components/Cell";
import Thumbnail from "../../../common_components/Thumbnail";
import { formatChatTime } from "@/core/utils";
import { useNavigation } from "@react-navigation/native";

const ChatRow = ({ item }) => {
  const navigation = useNavigation();

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
        <View style={styles.contentContainer}>
          <View style={styles.topRow}>
            <Text style={styles.username}>{item.friend.username}</Text>
            <View style={styles.rightTopRow}>
              <Text style={styles.time}>
                {formatChatTime(item.last_updated)}
              </Text>
            </View>
          </View>
          <View style={styles.topRow}>
            <Text
              style={styles.lastMessage}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.last_message_content}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBubble}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Cell>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  rightTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontWeight: "bold",
    color: "#202020",
    fontSize: 16,
    flex: 1,
  },
  time: {
    color: "#6EE7B7",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
  },
  unreadBubble: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 6,
  },
  unreadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  lastMessage: {
    color: "#606060",
    fontSize: 14,
    marginTop: 2,
  },
});
