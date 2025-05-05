import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SelectDrop from "@/common_components/SelectDrop";

const AuctionDeliveryMode = ({ handleSelectDelivery }) => {
  return (
    <View className="gap-y-2">
      <Text className="text-xl font-semibold">Delivery Type</Text>
      <SelectDrop
        placeholder={"Delivery"}
        selectItems={[
          { key: "Pickup", value: "Pickup" },
          { key: "Delivery", value: "Delivery" },
        ]}
        handleSelect={handleSelectDelivery}
      />
    </View>
  );
};

export default AuctionDeliveryMode;

const styles = StyleSheet.create({});
