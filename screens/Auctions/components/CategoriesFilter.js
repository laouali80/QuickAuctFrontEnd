import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { categories } from "@/mockData/categories";
import { COLORS } from "@/constants/COLORS";

const CategoriesFilter = () => {
  const [categoryClick, setCategoryClick] = useState(0);
  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const response = await apiRequest("auctions/categories/");

  //     // console.log(response);
  //     // setCategories(response.categories);
  //     // if (response.ok) {
  //     //   // const { token } = await response.json();
  //     //   const resp = await response.json();

  //     //   // return token;
  //     // }
  //     // const errMessage = await response.json();
  //     // console.log(errMessage);
  //   };

  //   fetchCategories();
  // }, []);

  const handleOnclick = (index) => {
    setCategoryClick(index);
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
        {categories.map((category, index) => (
          <TouchableOpacity
            onPress={() => handleOnclick(index)}
            key={index}
            style={[
              styles.categoryPill,
              index === categoryClick && styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                index === categoryClick && styles.activeCategoryText,
              ]}
            >
              {category.category}
            </Text>
          </TouchableOpacity>
        ))}
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
