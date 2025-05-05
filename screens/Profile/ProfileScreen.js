import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ProfileImage from "./components/ProfileImage";
import ProfileLogout from "./components/ProfileLogout";
import { useSelector } from "react-redux";
import { getUserInfo } from "@/state/reducers/userSlice";

const ProfileScreen = () => {
  const user = useSelector(getUserInfo);
  console.log(user);
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
        {user.first_name} {user.last_name}
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#606060",
          fontSize: 14,
        }}
      >
        {user.username}
      </Text>

      <ProfileLogout />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
