import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { COLORS } from "@/constants/COLORS";

const AuctionCard = ({ auction }) => {
  return (
    <VStack>
      <View>
        <Image />
        <Pressable>{/* LIKE ICON */}</Pressable>
      </View>

      {/* title */}
      <Text className="text-xl font-semibold">{auction.title}</Text>

      <HStack>
        <View
          style={{ alignItems: "center" }}
          className="bg-[#259e47] py-2 px-6"
        >
          <Text style={{ color: "white" }}>Bids: {auction.bids}</Text>
        </View>

        <View
          style={{ alignItems: "center", backgroundColor: "white" }}
          //   className="py-2 px-6"
        >
          <Text style={{ color: COLORS.primary }}>Ends in 1:07:28</Text>
        </View>
      </HStack>

      <HStack>
        <VStack>
          <Text>Current Bid</Text>
          <Text style={{ color: COLORS.primary }}>N 200</Text>
        </VStack>

        <View>
          <Pressable>{/* auction icon */}</Pressable>
        </View>
      </HStack>
    </VStack>
  );
};

export default AuctionCard;

const styles = StyleSheet.create({});
