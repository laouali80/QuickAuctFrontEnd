import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

const AuctionOverviewScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Auction Overview",
      headerTitleAlign: "center",
    });
  }, [navigation]);
  return (
    <View>
      <Text>AuctionOverviewScreen</Text>
    </View>
  );
};

export default AuctionOverviewScreen;

const styles = StyleSheet.create({});
