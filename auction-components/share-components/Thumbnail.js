import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const Thumbnail = ({ url, size }) => {
  return (
    <Image
      source={utils.thumbnail(url)}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "e0e0e0",
      }}
    />
  );
};

export default Thumbnail;

const styles = StyleSheet.create({});
