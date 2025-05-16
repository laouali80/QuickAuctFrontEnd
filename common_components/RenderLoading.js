import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SIZES } from "@/constants/SIZES";
import RenderFlatListHeader from "./RenderFlatListHeader";

const RenderLoading = () => {
  return (
    <View style={styles.contentContainer}>
      <RenderFlatListHeader />
      <ActivityIndicator style={{ flex: 1 }} />
    </View>
  );
};

export default RenderLoading;

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SIZES.CONTAINER_HEIGHT,
    paddingHorizontal: 16,
  },
});
