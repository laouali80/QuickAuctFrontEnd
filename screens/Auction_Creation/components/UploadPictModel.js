import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import SubmitButton from "@/common_components/SubmitButton";
import { COLORS } from "@/constants/COLORS";

const UploadPictModel = forwardRef(({ onCameraPress, onGalleryPress }, ref) => {
  const sheetRef = useRef();

  // Expose open and close to parent
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
  }));
  const handleCameraPress = () => {
    onCameraPress();
  };

  const handleGalleryPress = () => {
    onGalleryPress();
  };

  return (
    <RBSheet
      ref={sheetRef}
      height={300}
      // openDuration={250}
      closeOnPressMask={true}
      closeOnPressBack={true}
      // onClose={onClose}
      customStyles={{
        container: styles.sheetContainer,
        wrapper: styles.sheetWrapper,
      }}
    >
      <View style={styles.sheetContent}>
        <Text style={styles.title}>Upload Photo</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleGalleryPress}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="cloud-upload-sharp"
                size={40}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.optionText}>Upload Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleCameraPress}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="camera-sharp" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        <SubmitButton
          text="Next"
          // onPress={onNextPress}
          // style={styles.nextButton}
        />
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sheetWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  optionButton: {
    alignItems: "center",
    width: "40%",
  },
  optionIconContainer: {
    backgroundColor: "#f0f0f0",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  nextButton: {
    marginTop: 20,
  },
});

export default UploadPictModel;
