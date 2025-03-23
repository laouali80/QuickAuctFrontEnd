import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

const ProfileImage = () => {
  return (
    <TouchableOpacity
      style={{ marginBottom: 20 }}
      onPress={() => {
        launchImageLibrary(
          ({ includeBase64: true },
          (response) => {
            // utils.log("launchImageLibrary", response)

            if (response.didCancel) return;
            const file = response.assets[0];
          })
        );
      }}
    >
      <Image
        source={require("../assets/profiles/default.png")}
        style={{
          width: 100,
          height: 100,
          borderRadius: 90,
          backgroundColor: "#e0e0e0",
        }}
      />

      <View
        style={{
          backgroundColor: "#202020",
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
        <EvilIcons name="pencil" size={20} color="#d0d0d0" />
        {/* <Entypo name="log-out" size={15} color="#d0d0d0" /> */}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({});
