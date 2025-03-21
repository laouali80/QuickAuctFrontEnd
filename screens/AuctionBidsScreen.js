import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AuctionBidsScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Auction Bids",
      headerTitleAlign: "center",
    });
  }, [navigation]);
  return (
    <View>
      <Text>AuctionBidsScreen</Text>
    </View>
  );
};

export default AuctionBidsScreen;

const styles = StyleSheet.create({});
