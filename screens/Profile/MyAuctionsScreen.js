import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; // or react-native-vector-icons

const tabs = ["ongoing", "closed", "completed"];

const MyAuctionsScreen = ({
  auctions = [],
  completedAuctions = [],
  closedAuctions = [],
  toggleFavorite,
  onCreateAuction,
  onPublishDraft,
}) => {
  const [activeTab, setActiveTab] = useState("ongoing");

  const renderAuctionCard = (auction, type) => (
    <View
      key={auction.id}
      className="bg-white rounded-xl shadow p-3 flex-row space-x-3"
    >
      <Image
        source={{ uri: auction.image }}
        className="w-[120px] h-[100px] rounded-md"
        resizeMode="cover"
      />
      <View className="flex-1 justify-between">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-gray-800 font-medium">{auction.title}</Text>
            <Text className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 mt-1">
              {auction.category}
            </Text>
          </View>
          {type === "closed" ? (
            <Text className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
              Closed
            </Text>
          ) : (
            <TouchableOpacity onPress={() => toggleFavorite?.(auction.id)}>
              <FontAwesome
                name={auction.isFavorite ? "heart" : "heart-o"}
                size={18}
                color={auction.isFavorite ? "#f43f5e" : "#9ca3af"}
              />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row justify-between items-end mt-3">
          <View>
            {type === "ongoing" && (
              <>
                <Text className="text-green-500 font-semibold">
                  ${auction.currentBid}
                </Text>
                <Text className="text-xs text-gray-500">
                  {auction.bids} bids
                </Text>
              </>
            )}
            {type === "completed" && (
              <>
                <Text className="text-gray-700 font-semibold">
                  Final: ${auction.finalBid}
                </Text>
                <Text className="text-xs text-gray-500">
                  {auction.bids} bids
                </Text>
              </>
            )}
            {type === "closed" && (
              <>
                <Text className="text-gray-700 font-semibold">
                  Starting: ${auction.startingPrice}
                </Text>
                <Text className="text-xs text-gray-500">
                  Closed on: {auction.closedDate}
                </Text>
              </>
            )}
          </View>

          <View className="items-end">
            {type === "ongoing" && (
              <>
                <View className="flex-row items-center">
                  <FontAwesome name="clock-o" size={12} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {auction.timeRemaining}
                  </Text>
                </View>
                <Text
                  className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                    auction.status === "Ending Soon"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {auction.status}
                </Text>
              </>
            )}
            {type === "completed" && (
              <>
                <Text className="text-xs text-gray-500">
                  Ended: {auction.endDate}
                </Text>
                <Text className="text-xs mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {auction.status}
                </Text>
              </>
            )}
            {type === "closed" && (
              <Text className="text-xs mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {auction.status}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmpty = (type) => {
    const info = {
      ongoing: {
        icon: "gavel",
        title: "No ongoing auctions",
        desc: "You don't have any active auctions at the moment.",
        btn: "Create New Auction",
      },
      completed: {
        icon: "check-circle",
        title: "No completed auctions",
        desc: "You don't have any finished auctions yet.",
      },
      closed: {
        icon: "times-circle",
        title: "No closed auctions",
        desc: "You don't have any closed auctions saved.",
        btn: "Create New Auction",
      },
    };

    const IconComponent = type === "closed" ? FontAwesome5 : FontAwesome;

    return (
      <View className="items-center py-16">
        <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
          <IconComponent name={info[type].icon} size={28} color="#9ca3af" />
        </View>
        <Text className="text-lg font-medium text-gray-700 mb-2">
          {info[type].title}
        </Text>
        <Text className="text-gray-500 text-center mb-4 px-6">
          {info[type].desc}
        </Text>
        {info[type].btn && (
          <TouchableOpacity
            className="bg-green-500 px-4 py-2 rounded-lg"
            onPress={onCreateAuction}
          >
            <Text className="text-white font-medium">{info[type].btn}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getData = () => {
    if (activeTab === "ongoing") return auctions;
    if (activeTab === "completed") return completedAuctions;
    return closedAuctions;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tabs */}
      <View className="flex-row border-b border-gray-200">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-3 items-center ${
              activeTab === tab ? "border-b-2 border-green-500" : ""
            }`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`capitalize ${
                activeTab === tab
                  ? "text-green-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List or Empty */}
      <ScrollView className="px-4 pt-4 pb-20">
        {getData().length > 0
          ? getData().map((auction) => renderAuctionCard(auction, activeTab))
          : renderEmpty(activeTab)}
      </ScrollView>
    </View>
  );
};

export default MyAuctionsScreen;
