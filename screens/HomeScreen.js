// import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InsightsScreen from "./Insights/InsightsScreen";
import AuctionsScreen from "./Auctions/AuctionsScreen";
import CreationScren from "./Creation/CreationScren";
import ChatsScreen from "./Chats/ChatsScreen";
import ProfileScreen from "./Profile/ProfileScreen";

import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { Ionicons } from "@expo/vector-icons";

// const Tab = createBottomTabNavigator();

const Screen1 = () => {
  return <View style={styles.screen1} />;
};

const Screen2 = () => {
  return <View style={styles.screen2} />;
};

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const _renderIcon = (routeName, selectedTab) => {
    let icon = "";

    switch (routeName) {
      case "title1":
        icon = "ios-home-outline";
        break;
      case "title2":
        icon = "settings-outline";
        break;
    }

    return (
      <Ionicons
        name={icon}
        size={25}
        color={routeName === selectedTab ? "black" : "gray"}
      />
    );
  };
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      style={styles.bottomBar}
      shadowStyle={styles.shawdow}
      height={55}
      circleWidth={50}
      bgColor="white"
      initialRouteName="title1"
      borderTopLeftRight
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert("Click Action")}
          >
            <Ionicons name={"apps-sharp"} color="gray" size={25} />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBarExpo.Screen
        name="title1"
        position="LEFT"
        component={() => <Screen1 />}
      />
      {/* <CurvedBottomBarExpo.Screen
        name="title1"
        position="LEFT"
        component={() => <Screen1 />}
      /> */}
      <CurvedBottomBarExpo.Screen
        name="title2"
        component={() => <Screen2 />}
        position="RIGHT"
      />
      {/* <CurvedBottomBarExpo.Screen
        name="title2"
        component={() => <Screen2 />}
        position="RIGHT"
      /> */}
    </CurvedBottomBarExpo.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: "#DDDDDD",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E8",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: "gray",
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
    backgroundColor: "#BFEFFF",
  },
  screen2: {
    flex: 1,
    backgroundColor: "#FFEBCD",
  },
});

{
  /* <Tab.Navigator>
      <Tab.Screen name="Home" component={AuctionsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Creation" component={CreationScren} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator> */
}
