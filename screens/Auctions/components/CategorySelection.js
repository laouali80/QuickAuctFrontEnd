import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SelectDrop from "@/common_components/SelectDrop";
import apiRequest from "@/core/api";

const CategorySelection = ({ handleSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async (email, password) => {
      const response = await apiRequest("auctions/categories/");

      // console.log(response);
      setCategories(response.categories);
      // if (response.ok) {
      //   // const { token } = await response.json();
      //   const resp = await response.json();

      //   // return token;
      // }
      // const errMessage = await response.json();
      // console.log(errMessage);
    };

    fetchCategories();
  }, []);
  return (
    <SelectDrop
      placeholder="Category"
      // selectItems={[
      //   { key: "Electronics", value: "electronics" },
      //   { key: "Furniture", value: "furniture" },
      // ]}
      selectItems={categories}
      handleSelect={handleSelectCategory}
    />
  );
};

export default CategorySelection;

const styles = StyleSheet.create({});
