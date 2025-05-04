import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { sales } from "@/mockData/sales";
import SaleCard from "@/screens/Insights/components/SaleCard";
import Empty from "@/common_components/Empty";
import { COLORS } from "@/constants/COLORS";
import {
  fetchSalesAuctions,
  getAuctNextPage,
  getSalesAuctions,
} from "@/state/reducers/auctionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLoadMore } from "@/hooks/useLoadMore";

const Sales = () => {
  const dispatch = useDispatch();
  const NextPage = useSelector(getAuctNextPage);
  const salesAuctions = useSelector(getSalesAuctions);
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);

  // console.log("salesAuctions: ", salesAuctions);
  // Improved pagination handler
  const handleLoadMore = useLoadMore({
    isLoading,
    setIsLoading,
    NextPage,
    isCooldownRef,
    Action: fetchSalesAuctions,
  });

  // Show loading indicator
  if (salesAuctions === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no sales
  if (salesAuctions.length === 0) {
    return (
      <Empty
        icon={
          <FontAwesome5
            name="store"
            size={90}
            color={COLORS.primary}
            style={{
              margimBottom: 16,
            }}
          />
        }
        message="No Sales Yet"
      />
    );
  }
  return (
    <View className="flex-1 mx-6 mt-6 ">
      <FlatList
        data={salesAuctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SaleCard auction={item} />}
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

export default Sales;

const styles = StyleSheet.create({});
