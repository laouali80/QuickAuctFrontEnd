// --- helpers/scroll.js ---
import { SIZES } from "@/constants/SIZES";
import { Animated } from "react-native";

export const setupScrollAnimation = () => {
  const scrollY = new Animated.Value(0);
  const offsetY = new Animated.Value(0);
  const scrollOffset = { current: 0 };
  const scrollDirection = { current: "down" };

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

  return {
    scrollY,
    offsetY,
    clampedScroll,
    headerTranslate,
    onScroll,
    onScrollEnd,
  };
};
