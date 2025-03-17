import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import GetStartedTabs from "@/auction-components/GetStartedTabs";
import { COLORS } from "@/constants/COLORS";

const GetStartedScreen = () => {
  return (
    <SafeAreaView className="flex-1  h-full w-full ">
      {/* Full-height container */}
      {/* Top Section */}
      {/* <View className="h-[30%] flex flex-col  bg-[#259e47] p-8 justify-center items-center">
        <Text className="text-white text-3xl font-bold">QuickAuct</Text>
        <Text className="text-white text-lg">Get Started now</Text>
        <Text className="text-xl text-white text-center px-5">
          Create an account or login to view auctions
        </Text>
      </View> */}
      <View style={styles.header}>
        <Text style={styles.title} className="text-white text-3xl font-bold">
          QuickAuct
        </Text>
        <Text style={styles.title} className="text-white text-lg">
          Get Started now
        </Text>
        <Text className="text-xl text-white text-center px-5">
          Create an account or login to view auctions
        </Text>
      </View>
      <View className="h-[60%] py-5 px-8 justify-center items-center">
        <GetStartedTabs />
      </View>
    </SafeAreaView>
  );
};

export default GetStartedScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: "30%",
    backgroundColor: "#3B82F6", // Equivalent to bg-blue-500
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 18,
    color: "white",
  },
  description: {
    fontSize: 20,
    color: "#259e47",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  footer: {
    height: "60%",
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
});
