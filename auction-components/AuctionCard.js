import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

const AuctionCard = () => {
  return (
    <VStack>
      <View>
        <Image />
        <Pressable>{/* LIKE ICON */}</Pressable>
      </View>

      {/* title */}
      <Text className="text-xl font-semibold">Xbox Series S</Text>

      <HStack>
        <View
          style={{ alignItems: "center" }}
          className="bg-[#259e47] py-2 px-6"
        >
          <Text style={{ color: "white" }}>Bids: 3</Text>
        </View>

        <View
          style={{ alignItems: "center", backgroundColor: "white" }}
          //   className="py-2 px-6"
        >
          <Text style={{ color: "#259e47" }}>Ends in 1:07:28</Text>
        </View>
      </HStack>

      <HStack>
        <VStack>
          <Text>Current Bid</Text>
          <Text style={{ color: "#259e47" }}>N 200</Text>
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
