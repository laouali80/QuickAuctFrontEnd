import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { bids } from "@/mockData/bids";
import BidCard from "@/screens/Insights/components/BidCard";
import {
  fetchBidsAuctions,
  getAuction,
  getAuctionsList,
  getAuctNextPage,
  getBidsAuctions,
  selectAuctionsList,
  updateTime,
} from "@/state/reducers/auctionsSlice";
import { useDispatch, useSelector } from "react-redux";

import { useLoadMore } from "@/hooks/useLoadMore";
import { EmptyState } from "@/common_components/EmptyState";

const Bids = () => {
  const dispatch = useDispatch();
  const NextPage = useSelector(getAuctNextPage);
  const bidsAuctions = useSelector(getAuctionsList(listType='bids'));
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);

  // console.log("bidsAuctions: ", bidsAuctions);

  // Improved pagination handler
  const handleLoadMore = useLoadMore({
    isLoading,
    setIsLoading,
    data: { page: 1 },
    isCooldownRef,
    Action: fetchBidsAuctions,
  });

    // Timer for auction time updates
    useEffect(() => {
      const interval = setInterval(() => dispatch(updateTime({ listType: 'bids' })), 1000);
      return () => clearInterval(interval);
    }, []);
  // Show loading indicator
  if (bidsAuctions === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no bids
  if (bidsAuctions.length === 0) {
    return (
      <EmptyState type="bids" message="You have not bid any auction yet!" />
    );
  }

  return (
    <View className="flex-1 mx-6 mt-6 ">
      <FlatList
        data={bidsAuctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BidCard auction={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default Bids;

const styles = StyleSheet.create({});
