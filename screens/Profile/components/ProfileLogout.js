import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { logOutUser } from "@/state/reducers/userSlice";
import { persistor } from "@/state/store";
import { COLORS } from "@/constants/COLORS";
import { useNavigation } from "@react-navigation/native";
import secure from "@/core/secure";

const ProfileLogout = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch(); // Get dispatch function
  const handleLogout = async () => {
    dispatch(logOutUser());
    await persistor.purge(); // Clear Redux-persist storage
    await secure.removeUserSession("accessToken");
    navigation.navigate("GetStarted");

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
        backgroundColor: COLORS.primary,
        marginTop: 40,
      }}
      onPress={handleLogout}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        <Entypo
          name="log-out"
          size={20}
          color="#fff"
          style={{ marginRight: 12 }}
        />
        Logout
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileLogout;

const styles = StyleSheet.create({});
