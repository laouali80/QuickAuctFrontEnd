import { StyleSheet, Text, View } from "react-native";
import React from "react";

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
