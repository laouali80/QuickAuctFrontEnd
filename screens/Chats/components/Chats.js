import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useLayoutEffect } from "react";
import Empty from "@/common_components/Empty";
import ChatRow from "@/screens/Chats/components/ChatRow";
import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import { useDispatch, useSelector } from "react-redux";
import { getChatsList } from "@/state/reducers/chatsSlice";
import utils from "@/core/utils";

const Chats = ({ navigation }) => {
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, [navigation]);

  const chatsList = useSelector(getChatsList);
  // const chatsList = null;
  utils.log(chatsList);

  // Show loading indicator
  if (chatsList === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no chats
  if (chatsList.length === 0) {
    return (
      <Empty
        icon={
          <FontAwesome5
            name="inbox"
            size={90}
            color={COLORS.primary}
            style={{
              margimBottom: 16,
            }}
          />
        }
        message="No Chats yet"
      />
    );
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

export default Chats;

const styles = StyleSheet.create({});
