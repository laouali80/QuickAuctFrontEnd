import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AuctionScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Auction",
      headerTitleAlign: "center",
    });
  }, [navigation]);
  return (
    <View>
      <Text>AuctionScreen</Text>
    </View>
  );
};

export default AuctionScreen;

const styles = StyleSheet.create({});
