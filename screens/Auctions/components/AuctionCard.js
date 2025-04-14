import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "@/constants/COLORS";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Thumbnail from "@/common_components/Thumbnail";
import { formatAuctionTime } from "@/core/utils";

const AuctionCard = ({ auction }) => {
  const navigation = useNavigation();
  const [like, setLike] = useState("heart-o");

  const handleLike = () => {
    like === "heart-o" ? setLike("heart") : setLike("heart-o");
  };

  const _navigate = () => {
    navigation.navigate("Auction", auction);
  };
  return (
    <TouchableOpacity
      onPress={_navigate}
      style={{
        width: 175, // Fixed width for all cards
        flexDirection: "column",
        backgroundColor: COLORS.secondaryCard,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 26,
        marginVertical: 16,
        borderRadius: 10, // Optional: Add rounded corners
      }}
      className="gap-y-2"
    >
      {/* Image and Like Button */}
      <View>
        <Thumbnail
          url={auction.images[0]}
          width={120}
          height={100}
          borderRadius={10}
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

      {/* Title */}
      <Text
        className="text-lg font-semibold"
        numberOfLines={1} // Prevent text overflow
        ellipsizeMode="tail"
      >
        {auction.title}
      </Text>

      {/* Bids */}
      <View
        style={{ alignItems: "center", backgroundColor: COLORS.primary }}
        className=" py-1 px-2"
      >
        <Text style={{ color: "white" }}>Bids: {auction.bids.length}</Text>
      </View>

      {/* Ending Time (Fixed Width Container) */}
      <View
        style={{
          width: "100%", // Takes full width of the card
          backgroundColor: "white",
          paddingVertical: 8,
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: COLORS.primary }}
          numberOfLines={1} // Prevent text overflow
        >
          Ends in {formatAuctionTime(auction.end_time)}
        </Text>
      </View>

      {/* Current Bid and Auction Icon */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%", // Ensure full width
        }}
      >
        <View style={{ flexDirection: "column", rowGap: 4 }}>
          <Text style={{ color: COLORS.silverIcon }}>Current Bid</Text>
          <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
            {auction.current_price}
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
            source={require("../../../assets/icons/auction1.png")}
            style={{ width: 30, height: 30 }}
          />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default AuctionCard;

const styles = StyleSheet.create({});
