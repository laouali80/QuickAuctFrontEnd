import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { bids } from "@/mockData/bids";
import BidCard from "@/screens/Insights/components/BidCard";
import {
  fetchBidsAuctions,
  getAuctNextPage,
  getBidsAuctions,
} from "@/state/reducers/auctionsSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "@/common_components/Empty";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import { useLoadMore } from "@/hooks/useLoadMore";

const Bids = () => {
  const dispatch = useDispatch();
  const NextPage = useSelector(getAuctNextPage);
  const bidsAuctions = useSelector(getBidsAuctions);
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);

  console.log("bidsAuctions: ", bidsAuctions);

  // Improved pagination handler
  const handleLoadMore = useLoadMore({
    isLoading,
    setIsLoading,
    NextPage,
    isCooldownRef,
    Action: fetchBidsAuctions,
  });

  // Show loading indicator
  if (bidsAuctions === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no bids
  if (bidsAuctions.length === 0) {
    return (
      <Empty
        icon={
          <MaterialCommunityIcons
            name="gavel"
            size={90}
            color={COLORS.primary}
            style={{
              margimBottom: 16,
            }}
          />
        }
        message="You have not bid any auction yet!"
      />
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
