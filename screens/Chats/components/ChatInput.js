import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";

const ChatInput = ({ message, setMessage, onSend, loading }) => {
  const { type, isConnected, isInternetReachable } = useNetInfo();
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder={
          !isConnected
            ? "You're offline. Waiting for connection..."
            : "Type your message"
        }
        placeholderTextColor="#909090"
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderRadius: 25,
          borderColor: "#d0d0d0",
          backgroundColor: "white",
          height: 50,
        }}
        disabled={loading}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!message.trim() || !isConnected || !isInternetReachable}
      >
        <Entypo
          name="paper-plane"
          size={22}
          color="#303040"
          style={{
            marginHorizontal: 12,
            opacity: message.trim() ? 1 : 0.5,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({});
