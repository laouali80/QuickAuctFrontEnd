import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Bids from "./components/Bids";
import Sales from "./components/Sales";
import Likes from "./components/Likes";

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
        <HStack className="rounded-full w-full p-1.5 items-center bg-background-100 border border-outline-200">
          <TouchableOpacity
            className={`rounded-full flex-1 justify-center items-center px-3 py-1.5 ${
              selectedTab === "Bids" ? activeBg : "bg-background-100"
            }`}
            onPress={handleBidsPress}
          >
            <Text
              size="sm"
              className={`font-medium ${
                selectedTab === "Bids" ? "text-black" : "text-gray-500"
              }`}
            >
              Bids
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-full flex-1 justify-center items-center px-3 py-1.5 ${
              selectedTab === "Sales" ? activeBg : "bg-background-100"
            }`}
            onPress={handleSalesPress}
          >
            <Text
              size="sm"
              className={`font-medium ${
                selectedTab === "Sales" ? "text-black" : "text-gray-500"
              }`}
            >
              Sales
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-full flex-1 justify-center items-center px-3 py-1.5 ${
              selectedTab === "Likes" ? activeBg : "bg-background-100"
            }`}
            onPress={handleLikesPress}
          >
            <Text
              size="sm"
              className={`font-medium ${
                selectedTab === "Likes" ? "text-black" : "text-gray-500"
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
