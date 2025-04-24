import {
  Animated,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { getAuctionsList } from "@/state/reducers/auctionsSlice";
import * as Location from "expo-location";
import secure from "@/core/secure";

const CONTAINER_HEIGHT = 230;
const AuctionsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tokens = useSelector(getTokens);
  const auctionsList = useSelector(getAuctionsList);
  const user = useSelector(getUserInfo);
  const [errorMsg, setErrorMsg] = useState(null);

  console.log("from auctions: ", user);

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

  useLayoutEffect(() => {
    // console.log("Component mounted, fetching location...");

    Platform.OS === "web"
      ? dispatch(setLocation({ location: "Yola, Adamawa", token: tokens }))
      : getCurrentLocation();
  }, [getCurrentLocation]);

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

  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;

  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      offsetAnim
    ),
    0,
    CONTAINER_HEIGHT
  );

  let _clampedScrollValue = 0;
  let _offsetValue = 0;
  let _scrollValue = 0;

  useEffect(() => {
    const scrollListener = scrollY.addListener(({ value }) => {
      const diff = value - _scrollValue;
      _scrollValue = value;
      _clampedScrollValue = Math.min(
        Math.max(_clampedScrollValue + diff, 0),
        CONTAINER_HEIGHT
      );
    });

    const offsetListener = offsetAnim.addListener(({ value }) => {
      _offsetValue = value;
    });

    return () => {
      scrollY.removeListener(scrollListener);
      offsetAnim.removeListener(offsetListener);
    };
  }, []);

  let scrollEndTimer = null;
  const onMomentumScrollBegin = () => {
    clearTimeout(scrollEndTimer);
  };

  const onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue > CONTAINER_HEIGHT &&
      _clampedScrollValue > CONTAINER_HEIGHT / 2
        ? _offsetValue + CONTAINER_HEIGHT
        : _offsetValue - CONTAINER_HEIGHT;

    Animated.timing(offsetAnim, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const onScrollEndDrag = () => {
    scrollEndTimer = setTimeout(onMomentumScrollEnd, 250);
  };

  const headerTranslate = clampedScroll.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, -CONTAINER_HEIGHT],
    extrapolate: "clamp",
  });

  // const getContainerHeight = (height)=>{}

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
      <View style={{ marginTop: 20, flex: 1, marginTop: CONTAINER_HEIGHT }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Newest Items</Text>
          <Text
            style={{ fontSize: 22, fontWeight: "bold", color: COLORS.primary }}
          >
            Filters
          </Text>
        </View>

        {/* Auctions list */}
        <View>
          <Animated.FlatList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            data={auctionsList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AuctionCard auction={item} />}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              columnGap: 10,
            }}
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollEndDrag={onScrollEndDrag}
            scrollEventThrottle={1}
          />
        </View>
      </View>

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Header />
      </Animated.View>
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
  },
});
