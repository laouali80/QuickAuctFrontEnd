import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { categories } from "@/mockData/categories";
import { COLORS } from "@/constants/COLORS";

const CategoriesFilter = () => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => {
          return (
            <View
              style={{
                backgroundColor: index === 0 ? COLORS.primary : "#fff",
                marginRight: 36,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 10,

                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 7,
              }}
            >
              <Text style={{ color: index === 0 && "#fff", fontSize: 18 }}>
                {category.category}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoriesFilter;

const styles = StyleSheet.create({});
