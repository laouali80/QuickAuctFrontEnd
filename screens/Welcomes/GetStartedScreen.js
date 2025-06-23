import React, { useLayoutEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  PlatformColor,
  Platform,
  Image,
} from "react-native";

import GetStartedTabs from "@/screens/Welcomes/components/GetStartedTabs";
import { COLORS } from "@/constants/COLORS";

const GetStartedScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ flex: 1, backgroundColor: "#259e47" }}
    >
      {/* Top Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            className="h-max-[30%] py-4 px-6"
            style={{ backgroundColor: "#259e47" }} // keep your green
          >
            <View className="flex-row items-center space-x-2 mb-4">
              <Image
                source={require("../../assets/icons/shield.png")}
                style={{ width: 20, height: 20, marginBottom: 10 }}
                resizeMode="contain"
              />

              <Text
                className="text-white text-lg font-semibold"
                style={{ marginBottom: 10 }}
              >
                QuickAuct
              </Text>
            </View>

            <Text className="text-white text-3xl font-bold mb-2">
              Get Started now
            </Text>

            <Text className="text-white text-base">
              Create an account or log in to view auctions
            </Text>
          </View>

          {/* forms */}
          <View
            className="h-[60%] flex-1 py-2 px-2 justify-center items-center rounded-t-lg"
            style={{ backgroundColor: "white" }}
          >
            <GetStartedTabs />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default GetStartedScreen;
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "white",
  },
});
