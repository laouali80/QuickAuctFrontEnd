import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";

const TitleInput = ({ value, handleUpdTitle }) => {
  return (
    <TextInput
      placeholder="Product Title"
      style={{
        borderColor: COLORS.silverIcon,
        color: COLORS.primary,
        borderWidth: 1,
        fontWeight: "bold",
        borderRadius: 4,
        height: 35,
        paddingLeft: 10,
        width: "100%",
      }}
      // value={state.title}
      value={value}
      onChangeText={handleUpdTitle}
    />
  );
};

export default TitleInput;

const styles = StyleSheet.create({});
