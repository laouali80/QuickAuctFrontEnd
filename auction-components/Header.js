import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import SearchFilter from "./SearchFilter";
import CategoriesFilter from "./CategoriesFilter";

const Header = () => {
  const [h, setH] = useState(null);

  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: "700" }}>
          Yola, Adamawa {h}
        </Text>
        <FontAwesome name="bell-o" size={24} color={COLORS.primary} />
      </View>

      {/* Search filter */}

      <SearchFilter />

      {/* Categories filter*/}

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Categories</Text>
        <CategoriesFilter />
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({});
