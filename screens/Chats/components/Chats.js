import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Empty from "@/auction-components/share-components/Empty";
import ChatRow from "@/auction-components/ChatRow";

const Chats = () => {
  const chatsList = [];

  // Show loading indicator
  if (chatsList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no chats
  if (chatsList.length === 0) {
    return <Empty icon={{}} message="No Chats yet" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chatsList}
        renderItem={({ item }) => {
          <ChatRow item={item} />;
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({});
