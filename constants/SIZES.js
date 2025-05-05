import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export const SIZES = {
  height,
  width,
  CONTAINER_HEIGHT: 110,
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
};
