import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";
import CategoriesFilter from "@/screens/Auctions/components/CategoriesFilter";
import Icon from "react-native-vector-icons/FontAwesome";

const RenderFlatListHeader = ({
  selectedCategory,
  setSelectedCategory,
  showModal,
}) => {
  return (
    <>
      <CategoriesFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Newest Items</Text>
        <Pressable onPress={showModal}>
          <Text style={styles.filterText}>
            Filters
            <Icon
              name="sliders"
              size={24}
              style={{
                marginLeft: 10,
              }}
            />
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default RenderFlatListHeader;

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
