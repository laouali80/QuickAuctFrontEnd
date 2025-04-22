import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import SubmitButton from "@/common_components/SubmitButton";
import { COLORS } from "@/constants/COLORS";

const UploadPictModel = ({ show, onClose, onCameraPress, onGalleryPress }) => {
  const sheet = useRef();

  useEffect(() => {
    sheet.current.open();
  }, []);
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <RBSheet
      customStyles={{ container: styles.sheet }}
      // height={360}
      openDuration={250}
      closeOnPressMask={true}
      closeOnPressBack={true}
      ref={sheet}
    >
      <View style={styles.sheetContent}>
        <View className="flex flex-row justify-evenly">
          <TouchableOpacity
            className="items-center"
            onPress={() => {
              onCameraPress();
              onClose(); // Ensure parent state is updated
            }}
          >
            <Ionicons
              name="cloud-upload-sharp"
              size={40}
              color={COLORS.primary}
            />

            <Text>Upload Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => {
              onGalleryPress();
              onClose(); // Ensure parent state is updated
            }}
          >
            <Ionicons name="camera-sharp" size={40} color={COLORS.primary} />

            <Text>Take Photo</Text>
          </TouchableOpacity>
        </View>

        <SubmitButton text="Next" />
      </View>
    </RBSheet>
    // </SafeAreaView>
  );
};

export default UploadPictModel;

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetContent: {
    padding: 24,
    alignItems: "stretch",
  },
});
