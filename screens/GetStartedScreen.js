import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";

import GetStartedTabs from "@/auction-components/GetStartedTabs";

const GetStartedScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      {/* Top Section */}

      <ScrollView>
        <View className="h-[30%] bg-[#259e47] py-4 px-6">
          <Text
            style={styles.title}
            className="text-white text-xl font-semibold "
          >
            QuickAuct
          </Text>
          <Text
            style={styles.title}
            className="text-white text-3xl font-bold mt-4 mb-2"
          >
            Get Started now
          </Text>
          <Text style={styles.title} className="text-lg text-white">
            Create an account or login to view auctions
          </Text>
        </View>

        {/* forms */}
        <View className="h-[60%] py-5 px-2 justify-center items-center rounded-t-lg  ">
          <GetStartedTabs />
        </View>
      </ScrollView>
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
