import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const AddImages = ({ imageUri, showUploadModal, removeImg }) => {
  const imgs = imageUri.filter((img) => img != null);

  return (
    <VStack space="md">
      <Text className="text-xl font-semibold ">Add Images</Text>
      <HStack space="sm">
        {/* Render uploaded images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}
        >
          {imgs.map((img, index) => (
            <View key={index} style={{ position: "relative", marginRight: 10 }}>
              <Image
                source={{ uri: img }}
                style={styles.imagePreview}
                resizeMode="cover"
              />

              {index === imgs.length - 1 && (
                <TouchableOpacity
                  onPress={() => removeImg(index)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 2,
                    elevation: 4,
                  }}
                >
                  <MaterialCommunityIcons name="delete" size={18} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {/* Add button (show if less than 3 images) */}
          {imgs.length < 3 && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={showUploadModal}
            >
              <AntDesign name="plus" size={35} color="white" />
            </TouchableOpacity>
          )}
        </ScrollView>
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
