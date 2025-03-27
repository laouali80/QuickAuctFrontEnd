import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

import { COLORS } from "@/constants/COLORS";
import SearchFilter from "./SearchFilter";
import CategoriesFilter from "./CategoriesFilter";

const Header = () => {
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: "700" }}>
          Yola, Adamawa
        </Text>
        <FontAwesome icon={"bell-o"} size={24} color={COLORS.primary} />
      </View>

      {/* Search filter */}

      <SearchFilter />

      {/* Categories filter*/}

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Categories</Text>
        <CategoriesFilter />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
