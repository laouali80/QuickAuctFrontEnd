import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { sales } from "@/mockData/sales";
import SaleCard from "@/screens/Insights/components/SaleCard";

const Sales = () => {
  return (
    <View className="mx-6 mt-6 ">
      <FlatList
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SaleCard auction={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Sales;

const styles = StyleSheet.create({});
