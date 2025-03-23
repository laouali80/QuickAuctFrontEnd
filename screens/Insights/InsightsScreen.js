import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Bids from "./components/Bids";
import Sales from "./components/Sales";
import Likes from "./components/Likes";
import { COLORS } from "@/constants/COLORS";

const InsightsScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Bids");
  const colorScheme = useColorScheme();
  const activeBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";

  const handleBidsPress = useCallback(() => setSelectedTab("Bids"), []);
  const handleSalesPress = useCallback(() => setSelectedTab("Sales"), []);
  const handleLikesPress = useCallback(() => setSelectedTab("Likes"), []);

  return (
    <VStack className="flex-1">
      {/* Tab Switcher */}
      <HStack className=" mx-6 mt-6 items-center justify-between">
        <HStack className=" w-full p-1.5 items-center ">
          <TouchableOpacity
            className={`rounded-lg flex-1 justify-center items-center p-4 ${
              selectedTab === "Bids"
                ? `bg-[${COLORS.primary}]`
                : "bg-background-100"
            }`}
            onPress={handleBidsPress}
          >
            <Text
              size="sm"
              className={`font-bold ${
                selectedTab === "Bids" ? "text-[#fff]" : "text-gray-500"
              }`}
            >
              Bids
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-lg flex-1 justify-center items-center p-4  ${
              selectedTab === "Sales"
                ? `bg-[${COLORS.primary}]`
                : "bg-background-100"
            }`}
            onPress={handleSalesPress}
          >
            <Text
              size="sm"
              className={`font-bold ${
                selectedTab === "Sales" ? "text-white" : "text-gray-500"
              }`}
            >
              Sales
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-lg flex-1 justify-center items-center p-4  ${
              selectedTab === "Likes"
                ? `bg-[${COLORS.primary}]`
                : "bg-background-100"
            }`}
            onPress={handleLikesPress}
          >
            <Text
              size="sm"
              className={`font-bold ${
                selectedTab === "Likes" ? "text-white" : "text-gray-500"
              }`}
            >
              Likes
            </Text>
          </TouchableOpacity>
        </HStack>
      </HStack>

      {/* Dynamic view */}
      {selectedTab === "Bids" ? (
        <Bids />
      ) : selectedTab === "Sales" ? (
        <Sales />
      ) : (
        <Likes />
      )}
    </VStack>
  );
};

export default InsightsScreen;

const styles = StyleSheet.create({});
