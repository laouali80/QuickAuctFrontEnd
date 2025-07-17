import {
  ActivityIndicator,
  Animated,
  AppState,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/screens/Auctions/components/Header";
import { COLORS } from "@/constants/COLORS";
import { auctions } from "@/mockData/auctions";
import AuctionCard from "@/screens/Auctions/components/AuctionCard";

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
} from "@/core/auctionSocketManager";
import { store } from "@/state/store";
import {
  fetchAuctions,
  fetchCategories,
  getAuctionsList,
  getAuctNextPage,
  getCategories,
  getTotalAuctions,
  loadMore,
  selectAuctionsList,
  updateTime,
} from "@/state/reducers/auctionsSlice";
import * as Location from "expo-location";
import secure from "@/storage/secure";
import CategoriesFilter from "./components/CategoriesFilter";
import { useLoadMore } from "@/hooks/useLoadMore";
import Empty from "@/common_components/Empty";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { EmptyState } from "@/common_components/EmptyState";
import { useFocusEffect } from "@react-navigation/native";
import { SIZES } from "@/constants/SIZES";
import RenderLoading from "./components/RenderLoading";
import RenderEmpty from "./components/RenderEmpty";
import RenderFlatListHeader from "@/screens/Auctions/components/RenderFlatListHeader";
import FilterModal from "./components/FilterModal";
import {
  fetchAndSetCurrentLocation,
  handleRefresh,
} from "./handlers/auctionsScreenHandlers";
import { useNavigation } from "@react-navigation/native";
import {
  ChatSocketClose,
  initializeChatSocket,
} from "@/core/chatSocketManager";
import { setStore } from "@/core/storeRef";

const AuctionsScreen = ({ route }) => {
  const navigation = useNavigation();
  // -------------------- Redux State --------------------
  const dispatch = useDispatch();
  const tokens = useSelector(getTokens);
  // selectAuctionsList = (listType = 'all')

  const auctionsList = useSelector(getAuctionsList((listType = "all")));

  const NextPage = useSelector(getAuctNextPage);
  const user = useSelector(getUserInfo);
  const Total_auctions = useSelector(getTotalAuctions);

  // console.log('Total Auctions: ',Total_auctions)

  // -------------------- Local State --------------------
  const [selectedCategory, setSelectedCategory] = useState({
    key: 0,
    value: "All",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // -------------------- Refs --------------------
  const appState = useRef(AppState.currentState);
  const lastActiveRef = useRef(new Date());
  const didMountRef = useRef(false);
  const isCooldownRef = useRef(false);

  // ------------------- Debug --------------------

  // const logStoredAccessToken = async () => {
  //   const token = await secure.getCredentials();
  //   console.log("store Crcccedentials: ", token);
  // };

  // logStoredAccessToken();

  // console.log("auctions: ", auctionsList);
  // console.log("  auctions card: ");

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
  // useLayoutEffect(() => {
  //   Platform.OS === "web"
  //     ? dispatch(setLocation({ location: "Yola, Adamawa", token: tokens }))
  //     : fetchAndSetCurrentLocation(user, dispatch, setErrorMsg);
  // }, []);

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
    const interval = setInterval(
      () => dispatch(updateTime({ listType: "all" })),
      1000
    );
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

  const handleLoadMore = useLoadMore({
    isLoading,
    setIsLoading,
    data: { page: NextPage, category: selectedCategory },
    isCooldownRef,
    Action: loadMore,
  });

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

      {/* {auctionsList === null ? (
        <RenderLoading />
      ) : auctionsList.length === 0 ? (
        <RenderEmpty />
      ) : ( */}
      <Animated.FlatList
        data={auctionsList}
        // data={auctions}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <RenderFlatListHeader
            selectedCategory={selectedCategory}
            setSelectedCategory={(category) => setSelectedCategory(category)}
            showModal={() => setIsFilterVisible(true)}
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
        // pull up refresh
        onRefresh={() =>
          handleRefresh(setRefreshing, dispatch, selectedCategory)
        }
      />
      {/* )} */}
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onSubmit={(filters) => {
          console.log(filters); // Apply filtering logic here
        }}
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
