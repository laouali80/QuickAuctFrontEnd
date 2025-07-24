import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SIZES } from "@/constants/SIZES";
import RenderFlatListHeader from "./RenderFlatListHeader";
import AuctionCardSkeleton from "./AuctionCardSkeleton";

const SKELETON_COUNT = 6; // Show 6 skeletons (3 rows for 2 columns)

const RenderLoading = () => {
  return (
    <View style={styles.contentContainer}>
      <RenderFlatListHeader />
      {/* <ActivityIndicator style={{ flex: 1 }} /> */}
      <FlatList
        data={Array.from({ length: SKELETON_COUNT })}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", columnGap: 10 }}
        renderItem={() => <AuctionCardSkeleton />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RenderLoading;

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SIZES.CONTAINER_HEIGHT,
    paddingHorizontal: 16,
    flex: 1,
  },
});
