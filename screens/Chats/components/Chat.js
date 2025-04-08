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
import React, { useLayoutEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";

const Chat = ({ navigation, route }) => {
  const [message, setMessage] = useState("");

  // fetch from redux
  const messagesList = [];

  // WebSocket
  // const connectionId = route.params.id
  const friend = route.params.friend;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <ChatHeader friend={friend} />,
    });
  }, [navigation]);

  const onSend = () => {
    const cleaned = message.replace(/\s+/g, " ").trim();
    // console.log("onSend: ", cleaned);

    if (cleaned.length == 0) return;

    // WebSocket
    // messageSend(connectionId, cleaned)
    setMessage("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable onPress={Keyboard.dismiss}>
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
            data={messagesList}
            inverted={true}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              <MessageBubble index={index} message={item} friend={friend} />;
            }}
          />
        </View>
      </Pressable>

      {Platform.OS === "ios" ? (
        <InputAccessoryView>
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSend={onSend}
          />
        </InputAccessoryView>
      ) : (
        <ChatInput message={message} setMessage={setMessage} onSend={onSend} />
      )}
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({});
