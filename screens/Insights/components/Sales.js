import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { sales } from "@/mockData/sales";
import SaleCard from "@/screens/Insights/components/SaleCard";
import {
  fetchSalesAuctions,
  getAuctionsList,
  getAuctNextPage,
  getAuctPagination,
  getSalesAuctions,
  loadMoreAuctions,
  selectAuctionsList,
  updateTime,
} from "@/state/reducers/auctionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLoadMore } from "@/hooks/useLoadMore";
import { EmptyState } from "@/common_components/EmptyState";

const Sales = () => {
  const dispatch = useDispatch();
  const salesAuctions = useSelector(getAuctionsList((listType = "sales")));
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);
  const saleAuctsPagination = useSelector(
    getAuctPagination((listType = "sales"))
  );

  // console.log("salesAuctions: ", salesAuctions);

  // Improved pagination handler
  const handleLoadMore = salesAuctions
    ? useLoadMore({
        isLoading,
        setIsLoading,
        data: {
          pagination: saleAuctsPagination,
          listType: "sales",
        },
        isCooldownRef,
        loadMoreAuctions: loadMoreAuctions,
        auctionsCount: salesAuctions?.length,
        minCountToLoadMore: 4,
      })
    : () => {};

  // Show loading indicator
  if (salesAuctions === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no sales
  if (salesAuctions.length === 0) {
    return <EmptyState type="sales" message="No Sales Yet" />;
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
