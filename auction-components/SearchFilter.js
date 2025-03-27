import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const SearchFilter = () => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flexDirection: "row",
        paddingVertical: 16,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginVertical: 16,
        borderColor: COLORS.silverIcon,
        borderWidth: 1,

        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.4,
        // shadowRadius: 7,
      }}
    >
      <FontAwesome name="search" size={20} color={COLORS.primary} />

      <TextInput style={{ paddingLeft: 8, fontSize: 16, color: "#808080" }}>
        Search for anything...
      </TextInput>
    </View>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({});
