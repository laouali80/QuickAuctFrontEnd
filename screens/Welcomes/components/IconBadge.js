import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { refresh } from "@/state/reducers/auctionsSlice";

const IconBadge = ({ icon, badgeCount = 0, color, size }) => {
  const refreshPage = () => {
    console.log("test");
    refresh();
  };
  return (
    <View
      style={{ width: size || 24, height: size || 24, margin: 5 }}
      // onPress={refreshPage}
    >
      {/* <View style={{ width: size || 24, height: size || 24, margin: 5 }}> */}
      {icon}
      {badgeCount > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -3,
            backgroundColor: "red",
            borderRadius: 9,
            minWidth: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 3,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {badgeCount > 9 ? "9+" : badgeCount}
          </Text>
        </View>
      )}
      {/* </View> */}
    </View>
  );
};

export default IconBadge;

const styles = StyleSheet.create({});
