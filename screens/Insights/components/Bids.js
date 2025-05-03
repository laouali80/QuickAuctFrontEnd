import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { bids } from "@/mockData/bids";
import BidCard from "@/screens/Insights/components/BidCard";

const Bids = () => {
  return (
    <View className="flex-1 mx-6 mt-6 ">
      <FlatList
        data={bids}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BidCard auction={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default Bids;

const styles = StyleSheet.create({});
