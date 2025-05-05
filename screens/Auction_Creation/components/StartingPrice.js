import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";

const StartingPrice = ({ value, handleUpdPrice }) => {
  return (
    <View className="gap-y-2">
      <Text className="text-xl font-semibold ">Starting Price</Text>
      <TextInput
        placeholder="Starting Price"
        keyboardType="numeric"
        style={{
          borderColor: COLORS.silverIcon,
          color: "black",
          borderWidth: 1,
          // fontWeight: "bold",
          borderRadius: 4,
          height: 35,
          paddingLeft: 10,
        }}
        // value={state.price}
        value={value}
        onChangeText={handleUpdPrice}
      />
    </View>
  );
};

export default StartingPrice;

const styles = StyleSheet.create({});
