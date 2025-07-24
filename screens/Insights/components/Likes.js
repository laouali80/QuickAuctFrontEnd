import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { likes } from "@/mockData/likes";
import LikeCard from "@/screens/Insights/components/LikeCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLikesAuctions,
  getAuctionsList,
  getAuctNextPage,
  getAuctPagination,
  getLikesAuctions,
  loadMoreAuctions,
  selectAuctionsList,
} from "@/state/reducers/auctionsSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { EmptyState } from "@/common_components/EmptyState";

const Likes = () => {
  const dispatch = useDispatch();
  const likesAuctions = useSelector(getAuctionsList((listType = "likes")));
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);
  const likeAuctsPagination = useSelector(
    getAuctPagination((listType = "likes"))
  );

  console.log("likesAuctions: ", likesAuctions);

  // Improved pagination handler
  const handleLoadMore = likesAuctions
    ? useLoadMore({
        isLoading,
        setIsLoading,
        data: {
          pagination: likeAuctsPagination,
          listType: "bids",
        },
        isCooldownRef,
        loadMoreAuctions: loadMoreAuctions,
        auctionsCount: likesAuctions?.length,
        minCountToLoadMore: 4,
      })
    : () => {};
  // Show loading indicator
  if (likesAuctions === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no likes auctions
  if (likesAuctions.length === 0) {
    return <EmptyState type="likes" message="No Watch Auctions" />;
  }

  return (
    <View className="flex-1 mx-6 mt-6 ">
      <FlatList
        data={likesAuctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <LikeCard auction={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        // onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default Likes;

const styles = StyleSheet.create({});
