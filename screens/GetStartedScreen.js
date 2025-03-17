import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import GetStartedTabs from "@/auction-components/GetStartedTabs";
import { COLORS } from "@/constants/COLORS";

const GetStartedScreen = () => {
  return (
    <SafeAreaView className="flex-1  h-full w-full ">
      {/* Full-height container */}
      {/* Top Section */}
      <View className="h-[30%] flex flex-col  bg-[#259e47] p-8 justify-center items-center">
        <Text className="text-white text-3xl font-bold">QuickAuct</Text>
        <Text className="text-white text-lg">Get Started now</Text>
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
  //   container: `bg-white h-full w-full`,
  //   skipButton: `bg-gray-950/50 absolute top-16 right-8 z-50 py-3 px-4 rounded-md shadow-lg`,
  //   skipText: `text-white`,
  //   imageContainer: `h-[60%]`,
  //   image: `flex-1`,
  //   contentContainer: `h-[40%] py-5 px-8`,
  //   title: `text-center font-semibold text-xl text-[#2358ea]`,
  //   description: `text-gray-400 font-medium text-base text-center`,
  //   indicatorContainer: `flex flex-row justify-center pt-4 gap-x-2`,
  //   activeIndicator: `bg-orange-300 w-8 h-1`,
  //   inactiveIndicator: `bg-slate-200 w-4 h-1`,
  //   buttonContainer: `mt-auto`,
  //   primaryButton: `bg-[#2358ea] items-center p-5 rounded-lg mb-2`,
  //   primaryButtonText: `text-white font-bold`,
  //   secondaryButton: `border border-[#2358ea] items-center p-5 rounded-lg mb-2`,
  //   secondaryButtonText: `text-[#2358ea] font-bold`,
});
