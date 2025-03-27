import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logOutUser } from "@/state/reducers/userSlice";
import { persistor } from "@/state/store";

const ProfileLogout = ({ navigation }) => {
  const dispatch = useDispatch(); // Get dispatch function
  const handleLogout = async () => {
    dispatch(logOutUser());
    await persistor.purge(); // Clear Redux-persist storage

    // navigation.navigate("GetStarted");
  };

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
      onPress={handleLogout}
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
