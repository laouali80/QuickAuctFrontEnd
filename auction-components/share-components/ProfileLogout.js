import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
const ProfileLogout = () => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        height: 52,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 26,
        backgroundColor: "#202020",
        marginTop: 40,
      }}
      onPress={() => {}}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "#d0d0d0",
        }}
      >
        <Entypo
          name="log-out"
          size={20}
          color="#d0d0d0"
          style={{ marginRight: 12 }}
        />
        Logout
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileLogout;

const styles = StyleSheet.create({});
