import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "@/auction-components/Header";
import { COLORS } from "@/constants/COLORS";
import { auctions } from "@/mockData/auctions";
import AuctionCard from "@/auction-components/AuctionCard";

const AuctionsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
      <Header />

      <View style={{ marginTop: 20, flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Newest Items</Text>
          <Text
            style={{ fontSize: 22, fontWeight: "bold", color: COLORS.primary }}
          >
            Filters
          </Text>
        </View>

        {/* Auctions list */}
        <View>
          <FlatList
            data={auctions}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <AuctionCard auction={item} />}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuctionsScreen;

const styles = StyleSheet.create({});
