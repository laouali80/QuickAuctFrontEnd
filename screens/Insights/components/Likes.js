import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { likes } from "@/mockData/likes";
import LikeCard from "@/screens/Insights/components/LikeCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLikesAuctions,
  getAuctionsList,
  getAuctNextPage,
  getLikesAuctions,
  selectAuctionsList,
} from "@/state/reducers/auctionsSlice";
import { useLoadMore } from "@/hooks/useLoadMore";
import { EmptyState } from "@/common_components/EmptyState";

const Likes = () => {
  const dispatch = useDispatch();
  const NextPage = useSelector(getAuctNextPage);
  const likesAuctions = useSelector(getAuctionsList(listType='likes'));
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);

  console.log("likesAuctions: ", likesAuctions);

  // Improved pagination handler
  // const handleLoadMore = useCallback(() => {
  //   console.log("reach");
  //   // setIsLoading(true);

  //   if (isLoading || isCooldownRef.current || !NextPage) return;

  //   console.log("Loading more auctions...");
  //   setIsLoading(true);
  //   isCooldownRef.current = true;

  //   dispatch(fetchLikesAuctions({ page: NextPage }));

  //   // Delay cooldown reset until after 30 seconds
  //   setTimeout(() => {
  //     isCooldownRef.current = false;
  //   }, 30 * 1000);

  //   setIsLoading(false);
  // }, [isLoading, NextPage]);

  const handleLoadMore = useLoadMore({
    isLoading,
    setIsLoading,
    data: { page: NextPage },
    isCooldownRef,
    Action: fetchLikesAuctions,
  });

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
