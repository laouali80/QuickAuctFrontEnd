import {
  ActivityIndicator,
  Animated,
  AppState,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Header from "@/screens/Auctions/components/Header";
import { COLORS } from "@/constants/COLORS";
import { auctions } from "@/mockData/auctions";
import AuctionCard from "@/screens/Auctions/components/AuctionCard";
import {
  initializeChatSocket,
  ChatSocketClose,
} from "@/state/reducers/chatsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getTokens,
  getUserInfo,
  setLocation,
} from "@/state/reducers/userSlice";
import utils from "@/core/utils";
import {
  AuctionSocketClose,
  initializeAuctionSocket,
  setStore,
} from "@/core/auctionSocketManager";
import { store } from "@/state/store";
import {
  fetchAuctions,
  getAuctionsList,
  getAuctNextPage,
  loadMore,
  updateTime,
} from "@/state/reducers/auctionsSlice";
import * as Location from "expo-location";
import secure from "@/core/secure";
import CategoriesFilter from "./components/CategoriesFilter";
import { useLoadMore } from "@/hooks/useLoadMore";
import Empty from "@/common_components/Empty";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { EmptyState } from "@/common_components/EmptyState";
import { useFocusEffect } from "@react-navigation/native";

const CONTAINER_HEIGHT = 110;

const AuctionsScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const lastActiveRef = useRef(new Date());
  const appState = useRef(AppState.currentState);
  const [lastTimeStamp, setLastTimeStamp] = useState(null);

  const handleRefresh = () => {
    // console.log("reach the refresh");
    setRefreshing(true);
    dispatch(fetchAuctions({ page: 1 }));
    setRefreshing(false);
  };

  // Listen to app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const now = new Date();
        const last = lastActiveRef.current;
        const diff = (now - last) / (1000 * 60); // in minutes

        if (diff >= 5) {
          handleRefresh();
        }
      }

      appState.current = nextAppState;
      if (nextAppState === "active") {
        lastActiveRef.current = new Date(); // update on resume
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Also check when screen is focused (navigation)
  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      const last = lastActiveRef.current;
      const diff = (now - last) / (1000 * 60); // in minutes

      if (diff >= 5) {
        handleRefresh();
      }

      lastActiveRef.current = now;
    }, [])
  );

  const dispatch = useDispatch();
  const tokens = useSelector(getTokens);
  const auctionsList = useSelector(getAuctionsList);
  const user = useSelector(getUserInfo);
  const NextPage = useSelector(getAuctNextPage);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);

  // console.log("from auctions: ", user);
  // console.log("auctions: ", auctionsList);
  // console.log("next page: ", NextPage);

  const getCurrentLocation = async () => {
    try {
      // console.log("Requesting location permission...");
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.warn("Location permission denied");
        return;
      }

      // console.log("Fetching current location...");
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
      });

      let reverseGeoCode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (!reverseGeoCode || reverseGeoCode.length === 0) {
        setErrorMsg("Could not determine your location");
        return;
      }

      const { city, region } = reverseGeoCode[0];
      const stringLocation = `${city || "Unknown"}, ${region || "Unknown"}`;

      // console.log("Resolved Location:", stringLocation);

      if (user.location !== stringLocation) {
        dispatch(setLocation({ location: stringLocation }));
      }
    } catch (error) {
      console.error("Location error:", error);
      setErrorMsg("Failed to get location: " + error.message);
    }
  };

  // useLayoutEffect(() => {
  //   // console.log("Component mounted, fetching location...");

  //   Platform.OS === "web"
  //     ? dispatch(setLocation({ location: "Yola, Adamawa", token: tokens }))
  //     : getCurrentLocation();
  // }, [getCurrentLocation]);

  useEffect(() => {
    // utils.log('receive: ', tokens)
    setStore(store); // Initialize socket manager with store reference
    dispatch(initializeChatSocket(tokens)); // initialize chat socket channel
    dispatch(initializeAuctionSocket(tokens)); // initialize auction socket channel

    return () => {
      dispatch(ChatSocketClose());
      dispatch(AuctionSocketClose());
    };
  }, []);

  // Timer for updating time
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(updateTime());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;

  const clampedScroll = Animated.diffClamp(
    Animated.add(scrollY, offsetY),
    0,
    CONTAINER_HEIGHT
  );

  const headerTranslate = clampedScroll.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, -CONTAINER_HEIGHT],
    extrapolate: "clamp",
  });

  // Used to track whether we should snap header up/down
  const scrollOffset = useRef(0);
  const scrollDirection = useRef("down");

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        scrollDirection.current =
          currentOffset > scrollOffset.current ? "down" : "up";
        scrollOffset.current = currentOffset;
      },
    }
  );

  const onScrollEnd = () => {
    const toValue = scrollDirection.current === "down" ? CONTAINER_HEIGHT : 0;

    Animated.timing(offsetY, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Improved pagination handler
  const handleLoadMore = useLoadMore({
    isLoading,
    setIsLoading,
    NextPage,
    isCooldownRef,
    Action: loadMore,
  });

  // Show loading indicator
  // if (auctionsList === null) {
  //   return <ActivityIndicator style={{ flex: 1 }} />;
  // }

  // // Show empty if no  auctions
  // if (auctionsList.length === 0) {
  //   return <EmptyState type="auctions" message="No Watch Auctions" />;
  // }

  // <ScrollView refreshControl={
  //   <RefreshControl
  //   refreshing={false}
  //   onRefresh={
  //     ()=>{
  //       navigation.navigate('Auctions', {refreshTimeStamp: new Date()})
  //     }
  //   }
  //   />
  // }></ScrollView>

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            navigation.navigate("Auctions", { refreshTimeStamp: new Date() });
          }}
        />
      }
    >
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Header />
        {/* <FakeHeader /> */}
      </Animated.View>

      <Animated.FlatList
        data={auctionsList}
        // data={auctions}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          columnGap: 10,
        }}
        contentContainerStyle={{
          paddingTop: CONTAINER_HEIGHT, // makes room for sticky header
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <CategoriesFilter />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                Newest Items
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: COLORS.primary,
                }}
              >
                Filters
              </Text>
            </View>
          </>
        }
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        renderItem={({ item }) => <AuctionCard auction={item} />}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
        // onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReached={handleLoadMore}
        useNativeDriver={true}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

export default AuctionsScreen;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: CONTAINER_HEIGHT,
    zIndex: 10,
  },
});
