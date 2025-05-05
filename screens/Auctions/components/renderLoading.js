import { StyleSheet, Text, View } from "react-native";
import React from "react";
import renderFlatListHeader from "../renderFlatListHeader";
import { SIZES } from "@/constants/SIZES";

const renderLoading = () => {
  return (
    <View style={styles.contentContainer}>
      <renderFlatListHeader />
      <ActivityIndicator style={{ flex: 1 }} />
    </View>
  );
};

export default renderLoading;

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SIZES.CONTAINER_HEIGHT,
    paddingHorizontal: 16,
  },
});
