import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SelectDrop from "@/common_components/SelectDrop";

const ItemCondition = ({ handleSelectCondition }) => {
  return (
    <View className="gap-y-2">
      <Text className="text-xl font-semibold ">Product Type</Text>
      <SelectDrop
        placeholder={"Type"}
        selectItems={[
          { key: "used", value: "Used" },
          { key: "new", value: "New" },
        ]}
        handleSelect={handleSelectCondition}
      />
    </View>
  );
};

export default ItemCondition;

const styles = StyleSheet.create({});
