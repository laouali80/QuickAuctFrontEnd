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
  fetchCategories,
  getAuctionsList,
  getAuctNextPage,
  getCategories,
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
import { SIZES } from "@/constants/SIZES";
import RenderLoading from "../../common_components/RenderLoading";
import RenderEmpty from "../../common_components/RenderEmpty";
import RenderFlatListHeader from "@/common_components/RenderFlatListHeader";

const AuctionsScreen = ({ navigation, route }) => {
  // -------------------- Redux State --------------------
  const dispatch = useDispatch();
  const tokens = useSelector(getTokens);
  const auctionsList = useSelector(getAuctionsList);
  const NextPage = useSelector(getAuctNextPage);
  const user = useSelector(getUserInfo);

  // -------------------- Local State --------------------
  const [selectedCategory, setSelectedCategory] = useState({
    key: 0,
    value: "All",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // -------------------- Refs --------------------
  const appState = useRef(AppState.currentState);
  const lastActiveRef = useRef(new Date());
  const didMountRef = useRef(false);
  const isCooldownRef = useRef(false);

  // -------------------- Scroll Animation Setup --------------------
  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(0);
  const scrollDirection = useRef("down");

  const clampedScroll = Animated.diffClamp(
    Animated.add(scrollY, offsetY),
    0,
    SIZES.CONTAINER_HEIGHT
  );

  const headerTranslate = clampedScroll.interpolate({
    inputRange: [0, SIZES.CONTAINER_HEIGHT],
    outputRange: [0, -SIZES.CONTAINER_HEIGHT],
    extrapolate: "clamp",
  });

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
    const toValue =
      scrollDirection.current === "down" ? SIZES.CONTAINER_HEIGHT : 0;
    Animated.timing(offsetY, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // -------------------- Effects --------------------

  // Fetch auctions when category changes
  useEffect(() => {
    if (didMountRef.current) {
      dispatch(fetchAuctions({ page: 1, category: selectedCategory }));
    } else {
      didMountRef.current = true;
    }
  }, [selectedCategory.key]);

  // Get location and set on mount
  useLayoutEffect(() => {
    Platform.OS === "web"
      ? dispatch(setLocation({ location: "Yola, Adamawa", token: tokens }))
      : fetchAndSetCurrentLocation();
  }, []);

  // Initialize sockets, cleanup on unmount
  useEffect(() => {
    setStore(store);
    dispatch(initializeChatSocket(tokens));
    dispatch(initializeAuctionSocket(tokens));
    dispatch(fetchCategories());

    return () => {
      dispatch(ChatSocketClose());
      dispatch(AuctionSocketClose());
    };
  }, []);

  // Timer for auction time updates
  useEffect(() => {
    const interval = setInterval(() => dispatch(updateTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Resume-refresh listener
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const now = new Date();
        const last = lastActiveRef.current;
        const diff = (now - last) / (1000 * 60); // in minutes

        if (diff >= 5) handleRefresh();
      }

      appState.current = nextAppState;
      if (nextAppState === "active") lastActiveRef.current = new Date();
    });

    return () => subscription.remove();
  }, []);

  // Focus refresh logic
  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      const last = lastActiveRef.current;
      const diff = (now - last) / (1000 * 60);
      if (diff >= 5) handleRefresh();
      lastActiveRef.current = now;
    }, [])
  );

  // -------------------- Handlers --------------------

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchAuctions({ page: 1, category: selectedCategory }));
    setRefreshing(false);
  };

  const handleLoadMore = useLoadMore({
    isLoading,
    setIsLoading,
    data: { page: NextPage, category: selectedCategory },
    isCooldownRef,
    Action: loadMore,
  });

  const fetchAndSetCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
      });

      let reverseGeoCode = await Location.reverseGeocodeAsync(location.coords);
      if (!reverseGeoCode?.length) {
        setErrorMsg("Could not determine your location");
        return;
      }

      const { city, region } = reverseGeoCode[0];
      const stringLocation = `${city || "Unknown"}, ${region || "Unknown"}`;

      if (user.location !== stringLocation) {
        dispatch(setLocation({ location: stringLocation }));
      }
    } catch (error) {
      console.error("Location error:", error);
      setErrorMsg("Failed to get location: " + error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Header />
      </Animated.View>

      {auctionsList === null ? (
        <RenderLoading />
      ) : auctionsList.length === 0 ? (
        <RenderEmpty />
      ) : (
        <Animated.FlatList
          data={auctionsList}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <RenderFlatListHeader
              selectedCategory={selectedCategory}
              setSelectedCategory={(category) => setSelectedCategory(category)}
            />
          }
          ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
          renderItem={({ item }) => <AuctionCard auction={item} />}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onScrollEndDrag={onScrollEnd}
          onMomentumScrollEnd={onScrollEnd}
          onEndReached={handleLoadMore}
          useNativeDriver={true}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
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
    height: SIZES.CONTAINER_HEIGHT,
    zIndex: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    columnGap: 10,
  },
  listContent: {
    paddingTop: SIZES.CONTAINER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
