import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { bids } from "@/mockData/bids";
import BidCard from "@/auction-components/BidCard";

const Bids = () => {
  return (
    <View className="mx-6 mt-6 ">
      <FlatList
        data={bids}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BidCard auction={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Bids;

const styles = StyleSheet.create({});
