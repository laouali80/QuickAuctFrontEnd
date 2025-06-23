import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import utils from "@/core/utils";

const renderThumbnail = ({
  item,
  index,
  currentImageIndex,
  setCurrentImageIndex,
}) => {
  // console.log("imag url: ", item);

  return (
    <TouchableOpacity
      key={index}
      onPress={() => setCurrentImageIndex(index)}
      style={[
        styles.thumbnail,
        currentImageIndex === index && styles.thumbnailActive,
      ]}
    >
      <Image
        source={utils.thumbnail(item)}
        // source={{ uri: item }}
        style={styles.thumbnailImage}
      />
      {/* <Image source={item} style={styles.thumbnailImage} /> */}
    </TouchableOpacity>
  );
};

export default renderThumbnail;

const styles = StyleSheet.create({
  thumbnail: {
    width: 64,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailActive: {
    borderColor: "#22c55e",
  },
  thumbnailImage: { width: "100%", height: "100%", resizeMode: "cover" },
});
