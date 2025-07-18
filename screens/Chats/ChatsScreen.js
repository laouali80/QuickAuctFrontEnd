import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React from "react";
import ChatRow from "@/screens/Chats/components/ChatRow";
import { useSelector } from "react-redux";
import { getConversationsList } from "@/state/reducers/chatsSlice";
import utils from "@/core/utils";
import { EmptyState } from "@/common_components/EmptyState";
// import { EmptyState } from "@common_components/EmptyState";

const ChatsScreen = () => {
  const conversations = useSelector(getConversationsList);
  // console.log("ChatsScreen conversations: ", conversations);
  // Show loading indicator
  if (conversations === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no chats
  if (conversations.length === 0) {
    return <EmptyState type="chats" message="No Chats yet" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={conversations}
        renderItem={({ item }) => <ChatRow item={item} />}
        keyExtractor={(item) => item.connectionId}
      />
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    color: "#222",
  },
});
