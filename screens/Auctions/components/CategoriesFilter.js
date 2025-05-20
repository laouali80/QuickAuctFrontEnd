import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { categories } from "@/mockData/categories";
import { COLORS } from "@/constants/COLORS";
import apiRequest from "@/api/axiosInstance";
import { useSelector } from "react-redux";
import { getCategories } from "@/state/reducers/auctionsSlice";

const CategoriesFilter = ({ selectedCategory, setSelectedCategory }) => {
  // const [categoryClick, setCategoryClick] = useState(0);
  const categories = useSelector(getCategories) || [];

  const displayedCategories = [{ key: 0, value: "All" }, ...categories];
  // console.log("selectedCategory: ", typeof setSelectedCategory);
  const handleOnclick = (category) => {
    setSelectedCategory(category);
    // query({})
  };
  return (
    <View style={styles.categoriesContainer}>
      <Text style={styles.categoriesTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {Array.isArray(displayedCategories) &&
          displayedCategories.map(({ key, value }) => {
            const isActive = key === selectedCategory?.key;
            return (
              <TouchableOpacity
                onPress={() => handleOnclick({ key, value })}
                key={key}
                style={[styles.categoryPill, isActive && styles.activeCategory]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.activeCategoryText,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default CategoriesFilter;

const styles = StyleSheet.create({
  categoriesContainer: {
    marginTop: 8,
  },
  categoriesTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.darkText,
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingBottom: 8, // Extra space for scroll
  },
  categoryPill: {
    backgroundColor: "#fff",
    marginRight: 12,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: COLORS.silverIcon,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  activeCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.silverIcon,
    fontSize: 16,
  },
  activeCategoryText: {
    color: "#fff",
  },
});
