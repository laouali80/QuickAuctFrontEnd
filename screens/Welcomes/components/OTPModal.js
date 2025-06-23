import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import SubmitButton from "@/common_components/SubmitButton";
import { COLORS } from "@/constants/COLORS";

const OTPModal = forwardRef(({ tryAgain }, ref) => {
  const sheetRef = useRef();

  // Expose open and close to parent
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
  }));

  return (
    <RBSheet
      ref={sheetRef}
      height={300}
      closeOnPressMask={true}
      closeOnPressBack={true}
      customStyles={{
        container: styles.sheetContainer,
        wrapper: styles.sheetWrapper,
      }}
    >
      <View style={styles.sheetContent}>
        <MaterialIcons
          name="lock-outline"
          size={40}
          color={COLORS.primary}
          style={styles.icon}
        />

        <View style={styles.starsRow}>
          {[...Array(3)].map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={24}
              color={COLORS.primary}
              style={{ marginHorizontal: 4 }}
            />
          ))}
        </View>

        <Text style={styles.title}>Dear User</Text>

        <Text style={styles.message}>
          The OTP code you entered is incorrect. Please try again.
        </Text>
        <View className="w-[50%]">
          <SubmitButton
            text="Try Again"
            handleSubmit={tryAgain}
            textColor={"white"}
          />
        </View>
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
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  sheetWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 14,
  },
  icon: {
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    paddingHorizontal: 10,
  },
});

export default OTPModal;
