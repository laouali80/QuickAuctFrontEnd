import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import { useDispatch, useSelector } from "react-redux";
import { uploadThumbnail } from "@/state/reducers/chatsSlice";
import utils from "@/core/utils";
import { getUserInfo } from "@/state/reducers/userSlice";
import Thumbnail from "@/common_components/Thumbnail";
import * as ImagePicker from "expo-image-picker";
import UploadModal from "../UploadModal";

const ProfileImage = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const dispatch = useDispatch(); // Get dispatch function
  const user = useSelector(getUserInfo);

  // utils.log(user);

  const uploadImage = async (mode) => {
    let result = {};
    try {
      if (mode === "gallery") {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        // take picture
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        // console.log(result.assets[0].uri);
        const file = result.assets[0];
        // Dispatch the action correctly
        dispatch(uploadThumbnail(file));
      }
      // setShowUploadModal(false);
    } catch (error) {
      console.log("Error uploading image: " + error.message);
    }
  };

  return (
    <TouchableOpacity
      style={{ marginBottom: 20 }}
      onPress={() => setShowUploadModal(true)}
    >
      <Thumbnail
        url={user.thumbnail}
        width={100}
        height={100}
        borderRadius={90}
      />
      <View
        style={{
          backgroundColor: COLORS.primary,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 0,
          right: 0,
          borderWidth: 3,
          borderColor: "white",
        }}
      >
        <EvilIcons name="pencil" size={20} color="#fff" />
      </View>

      {showUploadModal && (
        <UploadModal
          show={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onCameraPress={() => uploadImage()}
          onGalleryPress={() => uploadImage("gallery")}
        />
      )}
    </TouchableOpacity>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({});
