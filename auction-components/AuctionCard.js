import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { COLORS } from "@/constants/COLORS";
import { Feather, FontAwesome } from "@expo/vector-icons";

const AuctionCard = ({ auction }) => {
  const [like, setLike] = useState("heart-o");

  const handleLike = () => {
    like === "heart-o" ? setLike("heart") : setLike("heart-o");
  };
  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: COLORS.secondary,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 26,
        marginVertical: 16,
      }}
      className="gap-y-2"
    >
      <View>
        <Image
          source={auction.image}
          style={{ width: 120, height: 100, borderRadius: 10 }}
        />

        <Pressable
          style={{
            backgroundColor: "#fff",
            width: 30,
            height: 30,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: -10,
            right: -10,
            borderWidth: 3,
            borderColor: "white",
          }}
          onPress={handleLike}
        >
          <FontAwesome name={like} size={20} color={COLORS.primary} />
        </Pressable>
      </View>

      {/* title */}
      <Text className="text-lg font-semibold">{auction.title}</Text>

      {/* <HStack> */}
      <View
        style={{ alignItems: "center", justifyContent: "center" }}
        className="bg-[#259e47] py-1 px-2"
      >
        <Text style={{ color: "white" }}>Bids: {auction.bids}</Text>
      </View>

      <View
        style={{
          alignItems: "center",
          backgroundColor: "white",
          alignSelf: "center",
          // flex: 1,
        }}
        className="py-2 px-1 w-full"
      >
        <Text style={{ color: COLORS.primary }}>
          Ends in {auction.endingTime}
        </Text>
      </View>
      {/* </HStack> */}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "column", flex: 1, rowGap: 4 }}>
          <Text>Current Bid</Text>
          <Text
            style={{ color: COLORS.primary, fontWeight: "bold" }}
            className="text-lg"
          >
            {auction.current_bid}
          </Text>
        </View>

        <Pressable
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 5,
          }}
        >
          <Image
            source={require("../assets/icons/auction1.png")}
            style={{ width: 30, height: 30 }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default AuctionCard;

const styles = StyleSheet.create({});
