import { StyleSheet } from "react-native";
import { COLORS } from "./COLORS";
import { SIZES } from "./SIZES";

export default stylesProductDetails = StyleSheet.create({
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: SIZES.width - 44, // xxlarge
    top: SIZES.xxLarge, // width
    zIndex: 999,
  },

  productDetails: {
    marginTop: -SIZES.large,
    backgroundColor: "",
    width: SIZES.width,
    borderTopLeftRadius: SIZES.medium,
    borderTopRightRadius: SIZES.medium,
  },

  titleRow: {
    marginHorizontal: 20,
    paddingBottom: SIZES.small,
    // flexDirection: "row",
    // justifyContent: "space-between",
    width: SIZES.width - 44,
    top: 20,
  },

  title: {
    fontFamily: "bold",
    fontSize: SIZES.large,
  },

  price: {
    fontFamily: "semibold",
    fontSize: SIZES.large,
    paddingHorizontal: 10,
  },
  priceWrapper: {
    backgroundColor: COLORS.secondaryCard,
    borderRadius: SIZES.large,
    // alignItems: "center",

    // Add solid red border
    borderWidth: 2, // Thickness of the border
    borderColor: "yellow", // Color of the border
    borderStyle: "solid", // Ensures the border is solid
  },

  ratingRow: {
    paddingBottom: SIZES.small,
    // flexDirection: "row",
    // justifyContent: "space-between",
    width: SIZES.width - 10,
    top: 5,
  },

  qtyRow: {
    paddingBottom: SIZES.small,

    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 10,
    top: 5,

    // Add solid red border
    borderWidth: 2, // Thickness of the border
    borderColor: "red", // Color of the border
    borderStyle: "solid", // Ensures the border is solid
  },

  rating: {
    top: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: SIZES.large,
  },

  qty: {
    top: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: SIZES.large,

    // Add solid red border
    borderWidth: 2, // Thickness of the border
    borderColor: "blue", // Color of the border
    borderStyle: "solid", // Ensures the border is solid
  },
  ratingText: {
    color: "grey",
    fontFamily: "medium",
    fontSize: 20,
  },

  descriptionWrapper: {
    marginTop: SIZES.large * 2,
    marginHorizontal: SIZES.large,
  },

  description: {
    fontFamily: "medium",
    fontSize: SIZES.large - 2,
  },

  descText: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "justify",
    marginBottom: SIZES.small,
  },

  reviewWrapper: {
    marginTop: SIZES.large * 2,
    marginHorizontal: SIZES.large,
  },

  addCartWrapper: {
    marginTop: SIZES.large * 2,
    marginHorizontal: SIZES.large,
  },
});
