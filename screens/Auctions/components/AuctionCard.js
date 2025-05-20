import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/constants/COLORS";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Thumbnail from "@/common_components/Thumbnail";
import { placeBid, watchAuction } from "@/state/reducers/auctionsSlice";
import { useSelector } from "react-redux";
import { getUserInfo } from "@/state/reducers/userSlice";

const AuctionCard = ({ auction }) => {
  const navigation = useNavigation();
  const user = useSelector(getUserInfo);
  const [like, setLike] = useState(
    auction.watchers.includes(user.userId) ? "heart" : "heart-o"
  );

  // console.log("user: ", user.userId);
  // console.log("get watchers: ", auction);

  const handleLike = () => {
    if (like === "heart-o") {
      setLike("heart");
      watchAuction({ auction_id: auction.id });
    } else {
      setLike("heart-o");
      watchAuction({ auction_id: auction.id });
    }
  };

  useEffect(() => {
    setLike(auction.watchers.includes(user.userId) ? "heart" : "heart-o");
  }, [auction.watchers]);

  // console.log("auction receive: ", auction.title, auction.images[0].image);
  const _navigate = () => {
    navigation.navigate("Auction", auction);
  };

  const RequestBid = () => {
    placeBid({
      auction_id: auction.id,
      current_price: parseInt(auction.current_price),
    });
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
          url={auction.images[0].image}
          // url={auction.images[0]}
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
          Ends in {auction.timeLeft}
        </Text>
      </View>

      <View
        style={{
          width: "100%", // Takes full width of the card
          // backgroundColor: "white",
          // paddingVertical: 8,
          alignItems: "flex-start",
        }}
      >
        <Text style={{ color: COLORS.silverIcon }}>Current Bid</Text>
        <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
          ${auction.current_price}
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
          <Text style={{ color: COLORS.silverIcon, marginTop: 4 }}>
            Bid Increment
          </Text>
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
            ${auction.bid_increment}
          </Text>
        </View>

        <Pressable
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 5,
          }}
          onPress={RequestBid}
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
