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
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import SearchFilter from "./SearchFilter";
import CategoriesFilter from "./CategoriesFilter";
import { categories } from "@/mockData/categories";

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Location and Notification */}
      <View style={styles.topBar}>
        <Text style={styles.locationText}>Yola, Adamawa</Text>
        <FontAwesome
          name="bell-o"
          size={24}
          color={COLORS.primary}
          style={styles.notificationIcon}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={20}
          color={COLORS.primary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search for anything..."
          placeholderTextColor="#808080"
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category, index) => (
            <View
              key={index}
              style={[
                styles.categoryPill,
                index === 0 && styles.activeCategory,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 && styles.activeCategoryText,
                ]}
              >
                {category.category}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
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
  searchContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderColor: COLORS.silverIcon,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkText,
    paddingVertical: 0, // Remove default padding on Android
  },
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
export default Header;
