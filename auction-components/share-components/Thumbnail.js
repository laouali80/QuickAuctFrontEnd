import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import utils from "@/core/utils";

const Thumbnail = ({ url, width, height, borderRadius }) => {
  console.log(utils.thumbnail(url));
  return (
    <Image
      source={utils.thumbnail(url)}
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        resizeMode: "cover",
        backgroundColor: "e0e0e0",
      }}
    />
  );
};

export default Thumbnail;

const styles = StyleSheet.create({});
