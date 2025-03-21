import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

const SaleCard = () => {
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

        <Text style={{ color: "#259e47" }}>N 300</Text>

        <View style={{ alignItems: "center" }}>
          <Text>Sold</Text>
        </View>
      </VStack>
    </HStack>
  );
};

export default SaleCard;

const styles = StyleSheet.create({});
