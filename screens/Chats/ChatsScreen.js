import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chats from "./components/Chats";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

const ChatsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
