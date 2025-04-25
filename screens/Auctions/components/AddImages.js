import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const AddImages = ({ imageUri, showUploadModal }) => {
  return (
    <VStack space="md">
      <Text className="text-xl font-semibold ">Add Images</Text>
      <HStack space="sm">
        {/* Placeholder or Uploaded Image */}
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Image 1</Text>
          </View>
        )}

        {/* Add Image Button */}
        <TouchableOpacity
          style={styles.addImageButton}
          onPress={showUploadModal}
        >
          <AntDesign name="plus" size={35} color="white" />
        </TouchableOpacity>
      </HStack>
    </VStack>
  );
};

export default AddImages;

const styles = StyleSheet.create({
  imagePreview: {
    width: 130,
    height: 100,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 130,
    height: 100,
    backgroundColor: "#e1e1e1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
  },
  addImageButton: {
    width: 130,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
