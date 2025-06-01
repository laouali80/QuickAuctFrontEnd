import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { icons } from "./themes";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ToastProps {}

export interface ToastConfig {
  type: "success" | "warning" | "error";
  text: string;
  duration: number;
}

export interface ToastRef {
  show: (config: ToastConfig) => void;
}

const Toast = forwardRef<ToastRef, ToastProps>(({}, ref) => {
  // console.log("Reach Toast............");
  const scaleAnimation = useSharedValue(0.9);
  const iconScaleAnimation = useSharedValue(1);
  const progressBarAnimation = useSharedValue(1);

  const toastTopAnimation = useSharedValue(-100);
  const context = useSharedValue(0);
  const [showing, setShowing] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<ToastConfig>({
    type: "success",
    text: "",
    duration: 8,
  });

  const TOP_VALUE = 60;
  useImperativeHandle(ref, () => ({ show }), []);
  const show = useCallback(({ duration, text, type }: ToastConfig) => {
    setShowing(true);
    setToastConfig({ type, text, duration });

    progressBarAnimation.value = withSpring(1, { duration: 0 });
    progressBarAnimation.value = withSpring(0, { duration });

    scaleAnimation.value = withTiming(1, { duration: 100 });
    iconScaleAnimation.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    toastTopAnimation.value = withSequence(
      withTiming(TOP_VALUE, { duration: 500 }),
      withDelay(
        duration,
        withTiming(-100, { duration: 500 }, (finish) => {
          if (finish) runOnJS(setShowing)(false);
        })
      )
    );
  }, []);

  const animatedTopStyles = useAnimatedStyle(() => ({
    top: toastTopAnimation.value,
    transform: [{ scale: scaleAnimation.value }],
    opacity: showing ? 1 : 0,
  }));

  const animatedIconStyles = useAnimatedStyle(() => ({
    transform: [{ scale: iconScaleAnimation.value }],
  }));

  const animatedProgressBarStyles = useAnimatedStyle(() => ({
    transform: [{ scaleX: progressBarAnimation.value }],
  }));

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      context.value = toastTopAnimation.value;
    })
    .onUpdate((event) => {
      if (event.translationY < 100) {
        toastTopAnimation.value = withSpring(
          context.value + event.translationY,
          {
            duration: 600,
            stiffness: 100,
          }
        );
      }
    })
    .onEnd((event) => {
      const isSwipeUp = event.translationY < 0;
      const newPosition = isSwipeUp ? -100 : TOP_VALUE;
      toastTopAnimation.value = withSpring(
        newPosition,
        { duration: 500 },
        (finish) => {
          if (finish && isSwipeUp) runOnJS(setShowing)(false);
        }
      );
    });

  const getToastStyles = useMemo(() => {
    switch (toastConfig.type) {
      case "success":
        return {
          container: [styles.toastContainer, styles.successToastContainer],
          text: styles.successToastText,
          progressBar: styles.successProgressBar,
        };
      case "warning":
        return {
          container: [styles.toastContainer, styles.warningToastContainer],
          text: styles.warningToastText,
          progressBar: styles.warningProgressBar,
        };
      case "error":
        return {
          container: [styles.toastContainer, styles.errorToastContainer],
          text: styles.errorToastText,
          progressBar: styles.errorProgressBar,
        };
      default:
        return {
          container: [styles.toastContainer, styles.successToastContainer],
          text: styles.successToastText,
          progressBar: styles.successProgressBar,
        };
    }
  }, [toastConfig.type]);

  const { container, text, progressBar } = getToastStyles;

  return showing ? (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[container, animatedTopStyles]}>
        <Animated.View>
          {toastConfig.type === "success"
            ? icons.success(animatedIconStyles)
            : toastConfig.type === "warning"
            ? icons.warning(animatedIconStyles)
            : icons.error(animatedIconStyles)}
        </Animated.View>
        <Text style={[styles.toastText, text]}>{toastConfig.text}</Text>
        <TouchableOpacity
          onPress={() => setShowing(false)}
          style={styles.closeButton}
        >
          {icons.close(styles.close)}
        </TouchableOpacity>
        <Animated.View
          style={[styles.progress_bar, progressBar, animatedProgressBarStyles]}
        ></Animated.View>
      </Animated.View>
    </GestureDetector>
  ) : null;
});

export default Toast;

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 10,
    width: "90%",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toastText: {
    marginLeft: 14,
    fontSize: 16,
    flex: 1,
  },
  successToastContainer: {
    backgroundColor: "#def1d7",
    borderColor: "#1f8722",
  },
  warningToastContainer: {
    backgroundColor: "#fef7ec",
    borderColor: "#f08135",
  },
  errorToastContainer: {
    backgroundColor: "#fae1db",
    borderColor: "#d9100a",
  },
  successToastText: {
    color: "#1f8722",
  },
  warningToastText: {
    color: "#f08135",
  },
  errorToastText: {
    color: "#d9100a",
  },
  progress_bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  closeButton: {
    marginLeft: 10,
    padding: 3,
  },
  close: {
    tintColor: "#888",
    // height: 16,
    // width: 16,
  },
  successProgressBar: {
    backgroundColor: "#1f8722",
  },
  warningProgressBar: {
    backgroundColor: "#f08135",
  },
  errorProgressBar: {
    backgroundColor: "#d9100a",
  },
});
