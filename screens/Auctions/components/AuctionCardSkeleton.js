import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AuctionCardSkeleton = () => {
  return (
    <View
      style={{
        width: 175,
        paddingHorizontal: 20,
        paddingVertical: 26,
        marginVertical: 16,
        borderRadius: 10,
      }}
      className="flex flex-col items-center gap-y-2 bg-gray-200 dark:bg-gray-800 animate-pulse"
    >
      {/* Image Placeholder */}
      <View className="relative">
        <View className="w-[120px] h-[100px] rounded-xl bg-gray-300 dark:bg-gray-700" />
        <View className="absolute -top-2.5 -right-2.5 w-[30px] h-[30px] rounded-full bg-white border-2 border-white" />
      </View>

      {/* Title Placeholder */}
      <View className="w-28 h-5 bg-gray-300 dark:bg-gray-700 rounded" />

      {/* Bids Placeholder */}
      <View className="bg-gray-400 dark:bg-gray-600 py-1 px-2 rounded">
        <View className="w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
      </View>

      {/* Ends in Placeholder */}
      <View className="w-full bg-white py-2 items-center rounded">
        <View className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
      </View>

      {/* Current Bid Placeholder */}
      <View className="w-full items-start">
        <View className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
        <View className="w-16 h-5 bg-gray-400 dark:bg-gray-600 rounded" />
      </View>

      {/* Bottom Row Placeholder */}
      <View className="flex-row justify-between w-full">
        <View className="space-y-1">
          <View className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
          <View className="w-14 h-5 bg-gray-400 dark:bg-gray-600 rounded" />
        </View>
        <View className="w-[40px] h-[40px] bg-white rounded-full p-2" />
      </View>
    </View>
  );
};

export default AuctionCardSkeleton;

const styles = StyleSheet.create({});
