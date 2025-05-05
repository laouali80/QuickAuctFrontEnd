import { StyleSheet, Text, View } from "react-native";
import React from "react";
import renderFlatListHeader from "../renderFlatListHeader";
import { SIZES } from "@/constants/SIZES";

const renderEmpty = () => {
  return (
    <View style={styles.contentContainer}>
      <renderFlatListHeader />
      <EmptyState type="auctions" message="No Watch Auctions" />
    </View>
  );
};

export default renderEmpty;

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SIZES.CONTAINER_HEIGHT,
    paddingHorizontal: 16,
  },
});
