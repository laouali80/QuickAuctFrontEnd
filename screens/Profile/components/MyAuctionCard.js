import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const MyAuctionCard = ({ title, category, timeLeft, bid, bids, imageUrl }) => {
  return (
    <View className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden">
      <View className="relative">
        <Image
          // source={{ uri: imageUrl }}
          source={imageUrl}
          className="w-full h-32"
          resizeMode="cover"
          style={{ width: "auto", height: 112 }}
        />
        <TouchableOpacity className="absolute top-2 right-2">
          <Icon name="heart" size={16} color="#22C55E" solid={false} />
        </TouchableOpacity>
      </View>
      <View className="p-3">
        <Text className="font-medium text-sm">{title}</Text>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            {category}
          </Text>
          <Text className="text-xs text-gray-500">{timeLeft}</Text>
        </View>
        <Text className="mt-2 text-xs text-gray-500">Current Bid</Text>
        <Text className="text-green-500 font-semibold">{bid}</Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-xs text-gray-500">Bids: {bids}</Text>
          <Icon name="arrow-right" size={14} color="#22C55E" />
        </View>
      </View>
    </View>
  );
};

export default MyAuctionCard;

const styles = StyleSheet.create({});
