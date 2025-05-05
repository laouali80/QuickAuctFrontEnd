import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React from "react";
import ChatRow from "@/screens/Chats/components/ChatRow";
import { useSelector } from "react-redux";
import { getChatsList } from "@/state/reducers/chatsSlice";
import utils from "@/core/utils";
import { EmptyState } from "@/common_components/EmptyState";

const ChatsScreen = () => {
  const chatsList = useSelector(getChatsList);

  // const chatsList = null;
  // utils.log(chatsList);

  // Show loading indicator
  if (chatsList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no chats
  if (chatsList.length === 0) {
    return <EmptyState type="chats" message="No Chats yet" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chatsList}
        renderItem={({ item }) => <ChatRow item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
