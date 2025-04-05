import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import SearchFilter from "./SearchFilter";
import CategoriesFilter from "./CategoriesFilter";
import { categories } from "@/mockData/categories";

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Location and Notification */}
      <View style={styles.topBar}>
        <View>
          <EvilIcons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.locationText}>Yola, Adamawa</Text>
        </View>

        <FontAwesome
          name="bell-o"
          size={24}
          color={COLORS.primary}
          style={styles.notificationIcon}
        />
      </View>

      {/* Search Bar */}
      <SearchFilter />

      {/* Categories */}
      <CategoriesFilter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.darkText,
  },
  notificationIcon: {
    marginLeft: 8,
  },
});
export default Header;
