import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SelectDrop from "@/common_components/SelectDrop";

const BidIncreament = ({ handleSelectIncreaseAmount }) => {
  return (
    <View className="gap-y-2">
      <Text className="text-xl font-semibold ">
        Increase Amount {"("}Optional{")"}
      </Text>
      <SelectDrop
        placeholder={"Type"}
        selectItems={[
          { value: "100", key: "100" },
          { value: "500", key: "500" },
          { value: "1k", key: "1000" },
          { value: "5k", key: "5000" },
          { value: "10k", key: "10000" },
        ]}
        handleSelect={handleSelectIncreaseAmount}
      />
    </View>
  );
};

export default BidIncreament;

const styles = StyleSheet.create({});
