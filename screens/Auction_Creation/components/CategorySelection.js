import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import SelectDrop from "@/common_components/SelectDrop";
import apiRequest from "@/api/axiosInstance";

const CategorySelection = ({ handleSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async (e) => {
      const response = await apiRequest("auctions/categories/");

      setCategories(response.categories);
    };

    fetchCategories();
  }, []);
  return (
    <SelectDrop
      placeholder="Category"
      selectItems={categories}
      handleSelect={handleSelectCategory}
    />
  );
};

export default CategorySelection;

const styles = StyleSheet.create({});
