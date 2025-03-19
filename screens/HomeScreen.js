import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InsightsScreen from "./Insights/InsightsScreen";
import AuctionsScreen from "./Auctions/AuctionsScreen";
import CreationScren from "./Creation/CreationScren";
import ChatsScreen from "./Chats/ChatsScreen";
import ProfileScreen from "./Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={AuctionsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Creation" component={CreationScren} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
