import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SIZES } from "@/constants/SIZES";
import RenderFlatListHeader from "./RenderFlatListHeader";
import { EmptyState } from "./EmptyState";

const RenderEmpty = () => {
  return (
    <View style={styles.contentContainer}>
      <RenderFlatListHeader />
      <EmptyState type="auctions" message="No Watch Auctions" />
    </View>
  );
};

export default RenderEmpty;

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SIZES.CONTAINER_HEIGHT,
    paddingHorizontal: 16,
  },
});
