import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CategoriesFilter from "./components/CategoriesFilter";
import { COLORS } from "@/constants/COLORS";

const renderFlatListHeader = () => {
  return (
    <>
      <CategoriesFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Newest Items</Text>
        <Text style={styles.filterText}>Filters</Text>
      </View>
    </>
  );
};

export default renderFlatListHeader;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  filterText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});
