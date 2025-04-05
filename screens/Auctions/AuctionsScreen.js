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
import Header from "@/auction-components/Header";
import { COLORS } from "@/constants/COLORS";
import { auctions } from "@/mockData/auctions";
import AuctionCard from "@/auction-components/AuctionCard";
import { socketClose, websocketConnection } from "@/state/reducers/chatsSlice";
import { useDispatch, useSelector } from "react-redux";
import { getTokens } from "@/state/reducers/userSlice";
import utils from "@/core/utils";

const CONTAINER_HEIGHT = 230;
const AuctionsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tokens = useSelector(getTokens);

  useEffect(() => {
    // utils.log('receive: ', tokens)
    dispatch(websocketConnection(tokens));

    return () => {
      dispatch(socketClose());
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
            data={auctions}
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
