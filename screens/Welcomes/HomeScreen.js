// import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InsightsScreen from "../Insights/InsightsScreen";
import AuctionsScreen from "../Auctions/AuctionsScreen";
import ChatsScreen from "../Chats/ChatsScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import IconBadge from "./components/IconBadge";
import { useSelector } from "react-redux";
import {
  getNewAuctions,
  getTotalAuctions,
} from "@/state/reducers/auctionsSlice";
import { getNewChats, getUnreadCount } from "@/state/reducers/chatsSlice";
import { getUserInfo } from "@/state/reducers/userSlice";
import UpdateProfileModal from "./components/UpdateProfModal";
import AuctionLimitModal from "./components/AuctionLimitModal";

const HomeScreen = ({ navigation }) => {
  const newAuctions = useSelector(getNewAuctions);
  // const newChats = useSelector(getNewChats);
  const user = useSelector(getUserInfo);
  const Total_auctions = useSelector(getTotalAuctions);
  const unReadCount = useSelector(getUnreadCount);

  console.log("unreadCount: ", unReadCount);
  // const Total_auctions = 10;

  console.log("Total Auctions from home: ", Total_auctions);

  const isProfileIncomplete =
    !user.first_name && !user.last_name && !user.phone_number && !user.address;
  const [isUpdProfModalOpen, setIsUpdProfModalOpen] = useState(false);
  const [isAuctLimitModalOpen, setIsAuctLimitModalOpen] = useState(false);

  const handleCreationButtonPress = () => {
    if (isProfileIncomplete) {
      setIsUpdProfModalOpen(true); // block and ask for update
    } else if (Total_auctions === 10) {
      setIsAuctLimitModalOpen(true);
    } else {
      navigation.navigate("AuctionCreation");
    }
  };

  // console.log("got you guys: ", newAuctions, newChats);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const _renderIcon = (routeName, selectedTab) => {
    let icon = "";

    switch (routeName) {
      case "Auctions":
        icon = (
          <Ionicons
            name={routeName === selectedTab ? "home-sharp" : "home-outline"}
            size={25}
            color={
              routeName === selectedTab ? COLORS.primary : COLORS.silverIcon
            }
          />
        );
        return <IconBadge icon={icon} badgeCount={newAuctions} />;

      case "Insights":
        icon = (
          <Feather
            name="trending-up"
            size={25}
            color={
              routeName === selectedTab ? COLORS.primary : COLORS.silverIcon
            }
          />
        );
        break;
      case "Chats":
        icon = (
          <Ionicons
            name={
              routeName === selectedTab
                ? "chatbubble-ellipses-sharp"
                : "chatbubble-ellipses-outline"
            }
            size={24}
            color={
              routeName === selectedTab ? COLORS.primary : COLORS.silverIcon
            }
          />
        );

        return <IconBadge icon={icon} badgeCount={unReadCount} />;
      case "Profile":
        icon = (
          <FontAwesome
            name={routeName === selectedTab ? "user-circle-o" : "user-circle"}
            size={24}
            color={
              routeName === selectedTab ? COLORS.primary : COLORS.silverIcon
            }
          />
        );
        break;
    }

    return icon;
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
    <>
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        style={styles.bottomBar}
        shadowStyle={styles.shawdow}
        height={55}
        circleWidth={50}
        bgColor="white"
        initialRouteName="Auctions"
        borderTopLeftRight
        renderCircle={({ selectedTab, navigate }) => (
          <Animated.View style={styles.btnCircleUp}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreationButtonPress}
            >
              <Ionicons name="add" size={25} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
      >
        <CurvedBottomBarExpo.Screen
          options={{ headerShown: false }}
          name="Auctions"
          position="LEFT"
          component={() => <AuctionsScreen />}
        />
        <CurvedBottomBarExpo.Screen
          options={{ headerTitleAlign: "center" }}
          name="Insights"
          position="LEFT"
          component={() => <InsightsScreen />}
        />
        <CurvedBottomBarExpo.Screen
          options={{ headerTitleAlign: "center" }}
          name="Chats"
          component={() => <ChatsScreen />}
          position="RIGHT"
          // options={{ headerShown: false }}
        />
        <CurvedBottomBarExpo.Screen
          options={{ headerTitleAlign: "center" }}
          name="Profile"
          component={() => <ProfileScreen />}
          position="RIGHT"
        />
      </CurvedBottomBarExpo.Navigator>
      <UpdateProfileModal
        visible={isUpdProfModalOpen}
        onClose={() => setIsUpdProfModalOpen(false)}
        onSubmit={() => {
          setIsUpdProfModalOpen(false);
          navigation.navigate("Profile", true);
        }}
      />
      <AuctionLimitModal
        visible={isAuctLimitModalOpen}
        onClose={() => setIsAuctLimitModalOpen(false)}
        onGoToProfile={() => {
          setIsAuctLimitModalOpen(false);
          navigation.navigate("Home", { screen: "Profile" });
        }}
      />
    </>
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
    backgroundColor: "#259e47",
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

// const Tab = createBottomTabNavigator();
{
  /* <Tab.Navigator>
      <Tab.Screen name="Home" component={AuctionsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Creation" component={CreationScren} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator> */
}
