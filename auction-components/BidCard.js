import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

const BidCard = () => {
  return (
    <HStack>
      <View>
        <Image />
      </View>

      <VStack>
        <HStack>
          <Text className="text-xl font-semibold">Macbook Pro 16</Text>
          <Text>23/05/2022</Text>
        </HStack>

        <HStack>
          <View
            style={{ alignItems: "center" }}
            className="bg-[#259e47] py-2 px-6"
          >
            <Text style={{ color: "white" }}>Bids: 3</Text>
          </View>
          <Text style={{ color: "#259e47" }}>Ends in 1:07:28</Text>
        </HStack>

        <HStack>
          <VStack>
            <Text>Winning Bid</Text>
            <Text style={{ color: "#259e47" }}>N 300</Text>
          </VStack>

          <VStack>
            {/* winning icon */}
            <View style={{ alignItems: "center" }}>
              <Text>Won</Text>
            </View>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default BidCard;

const styles = StyleSheet.create({});
