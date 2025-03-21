import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import ProfileLogout from "@/auction-components/share-components/ProfileLogout";
import ProfileImage from "@/auction-components/ProfileImage";

const ProfileScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 100,
      }}
    >
      <ProfileImage />

      <Text
        style={{
          textAlign: "center",
          color: "#303030",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 6,
        }}
      >
        Test User
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#606060",
          fontSize: 14,
        }}
      >
        @testmic
      </Text>

      <ProfileLogout />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
