import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const renderThumbnail = ({
  item,
  index,
  currentImageIndex,
  setCurrentImageIndex,
}) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => setCurrentImageIndex(index)}
      style={[
        styles.thumbnail,
        currentImageIndex === index && styles.thumbnailActive,
      ]}
    >
      {/* <Image source={{ uri: item }} style={styles.thumbnailImage} /> */}
      <Image source={item} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );
};

export default renderThumbnail;

const styles = StyleSheet.create({});
