import {
  FlatList,
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import ChatHeader from "./components/ChatHeader";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import {
  getMessages,
  messageSend,
  messagesList,
  messageTyping,
  setActiveChat,
} from "@/state/reducers/chatsSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  // fetch from redux
  // const messagesList = [];
  const messages = useSelector(getMessages);
  // const messageType = dispatch(me)
  // console.log("messages: ", messages);

  // WebSocket
  const connectionId = route.params.id;
  const friend = route.params.friend;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <ChatHeader friend={friend} />,
    });
  }, [navigation]);

  useEffect(() => {
    dispatch(messagesList(connectionId));
    dispatch(setActiveChat(friend.username));
    return () => {
      dispatch(setActiveChat(null));
    };
  }, [friend.username, dispatch]);

  const onSend = () => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    // console.log("onSend: ", cleaned);

    if (cleaned.length == 0) return;

    // WebSocket
    messageSend({ connectionId, content: cleaned });
    setMessage("");
  };

  const onTyping = (value) => {
    setMessage(value);
    messageTyping(friend.username);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            marginBottom: Platform.OS === "ios" ? 60 : 0,
          }}
        >
          <FlatList
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{
              paddingTop: 30,
            }}
            data={[{ id: -1 }, ...messages]}
            inverted={true}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              // console.log()
              <MessageBubble index={index} message={item} friend={friend} />
            )}
          />
        </View>
      </Pressable>

      {Platform.OS === "ios" ? (
        <InputAccessoryView>
          <ChatInput message={message} setMessage={onTyping} onSend={onSend} />
        </InputAccessoryView>
      ) : (
        <ChatInput message={message} setMessage={onTyping} onSend={onSend} />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
