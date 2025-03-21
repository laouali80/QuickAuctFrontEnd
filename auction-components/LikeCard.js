import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const LikeCard = () => {
  return (
    <HStack>
      <View>
        <Image />
      </View>

      <VStack>
        <HStack>
          <Text className="text-xl font-semibold">Macbook Pro 16</Text>
          <Pressable>{/* delete icon */}</Pressable>
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
            <Pressable>{/* bid icon */}</Pressable>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default LikeCard;

const styles = StyleSheet.create({});
