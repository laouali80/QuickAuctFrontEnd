import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Bids from "./components/Bids";
import Sales from "./components/Sales";
import Likes from "./components/Likes";
import { COLORS } from "@/constants/COLORS";
import {
  fetchBidsAuctions,
  fetchLikesAuctions,
  fetchSalesAuctions,
} from "@/state/reducers/auctionsSlice";
import { useDispatch } from "react-redux";

const InsightsScreen = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("Bids");
  const colorScheme = useColorScheme();
  const activeBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";

  const handleBidsPress = useCallback(() => {
    dispatch(fetchBidsAuctions({ page: 1 }));
    setSelectedTab("Bids");
  }, []);
  const handleSalesPress = useCallback(() => {
    // console.log("sales...");
    dispatch(fetchSalesAuctions({ page: 1 }));
    setSelectedTab("Sales");
  }, []);
  const handleLikesPress = useCallback(() => {
    console.log("reach here");
    dispatch(fetchLikesAuctions({ page: 1 }));
    setSelectedTab("Likes");
  }, []);

  return (
    <VStack className="flex-1 bg-white">
      {/* Tab Switcher */}
      <View className="mx-6 mt-6 mb-4 bg-gray-100 rounded-xl p-1.5">
        <HStack className="w-full ">
          <TouchableOpacity
            className={`flex-1 justify-center items-center py-4 mx-1 rounded-lg ${
              selectedTab === "Bids" ? "shadow-xl" : ""
            }`}
            style={{
              backgroundColor:
                selectedTab === "Bids" ? COLORS.primary : COLORS.gray100,
            }}
            onPress={handleBidsPress}
            activeOpacity={0.7}
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color:
                  selectedTab === "Bids" ? COLORS.white : COLORS.silverIcon,
              }}
            >
              Bids
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 justify-center items-center py-3 mx-1 rounded-lg ${
              selectedTab === "Sales" ? "shadow-xl" : ""
            }`}
            style={{
              backgroundColor:
                selectedTab === "Sales" ? COLORS.primary : COLORS.gray100,
            }}
            onPress={handleSalesPress}
            activeOpacity={0.7}
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color:
                  selectedTab === "Sales" ? COLORS.white : COLORS.silverIcon,
              }}
            >
              Sales
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 justify-center items-center py-3 mx-1 rounded-lg ${
              selectedTab === "Likes" ? "shadow-xl" : ""
            }`}
            style={{
              backgroundColor:
                selectedTab === "Likes" ? COLORS.primary : COLORS.gray100,
            }}
            onPress={handleLikesPress}
            activeOpacity={0.7}
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color:
                  selectedTab === "Likes" ? COLORS.white : COLORS.silverIcon,
              }}
            >
              Likes
            </Text>
          </TouchableOpacity>
        </HStack>
      </View>

      {/* Dynamic view with smooth transition */}
      <View className="flex-1">
        {selectedTab === "Bids" && <Bids />}
        {selectedTab === "Sales" && <Sales />}
        {selectedTab === "Likes" && <Likes />}
      </View>
    </VStack>
  );
};

export default InsightsScreen;

const styles = StyleSheet.create({});
