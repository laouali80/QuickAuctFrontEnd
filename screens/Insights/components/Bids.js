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
import { FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const Bids = () => {
  const dispatch = useDispatch();
  const NextPage = useSelector(getAuctNextPage);
  const bidsAuctions = useSelector(getBidsAuctions);
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);

  // Improved pagination handler
  const handleLoadMore = useCallback(() => {
    console.log("reach");
    // setIsLoading(true);

    if (isLoading || isCooldownRef.current || !NextPage) return;

    console.log("Loading more auctions...");
    setIsLoading(true);
    isCooldownRef.current = true;

    dispatch(fetchBidsAuctions({ page: NextPage }));

    // Delay cooldown reset until after 30 seconds
    setTimeout(() => {
      isCooldownRef.current = false;
    }, 30 * 1000);

    setIsLoading(false);
  }, [isLoading, NextPage]);

  // Show loading indicator
  if (bidsAuctions === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no chats
  if (bidsAuctions.length === 0) {
    return (
      <Empty
        icon={
          <Pressable
            style={
              {
                // width: 130,
                // height: 130,
                // borderRadius: 130 / 2,
                // alignItems: "center",
                // justifyContent: "center",
                // backgroundColor: COLORS.lightPrimary,
                // borderWidth: 3,
                // borderColor: "white",
              }
            }
            onPress={handleLike}
          >
            <FontAwesome5
              name="inbox"
              size={90}
              color={COLORS.primary}
              style={{
                margimBottom: 16,
              }}
            />
          </Pressable>
        }
        message="You have not bid any auction yet!"
      />
    );
  }

  return (
    <View className="flex-1 mx-6 mt-6 ">
      <FlatList
        data={bids}
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
