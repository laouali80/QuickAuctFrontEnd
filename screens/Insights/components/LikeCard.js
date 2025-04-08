import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const LikeCard = ({ auction }) => {
  const navigation = useNavigation();
  const _navigate = () => {
    navigation.navigate("Auction");
  };
  return (
    <TouchableOpacity
      onPress={_navigate}
      style={{
        flexDirection: "row",
        borderWidth: 1,
        borderColor: COLORS.silverIcon,
        marginBottom: 10,
        borderRadius: 10,
        padding: 12,
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      {/* Image Container */}
      <View style={{ marginRight: 12 }}>
        <Image
          source={auction.image}
          style={{
            width: 120,
            height: 100,
            borderRadius: 10,
            resizeMode: "cover",
          }}
        />
      </View>

      {/* Content Container */}
      <View style={{ flex: 1 }}>
        {/* Title and Delete Button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              flex: 1,
              marginRight: 8,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {auction.title}
          </Text>
          <Pressable>
            <AntDesign name="delete" size={20} color={COLORS.silverIcon} />
          </Pressable>
        </View>

        {/* Bids and Time Container */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: "#259e47",
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>
              Bids: {auction.bids}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: COLORS.silverIcon,
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 12 }}>
              Ends in {auction.endingTime}
            </Text>
          </View>
        </View>

        {/* Bid and Auction Icon */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                color: COLORS.silverIcon,
                fontSize: 12,
                marginBottom: 4,
              }}
            >
              Current Bid
            </Text>
            <Text
              style={{
                color: COLORS.primary,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {auction.current_bid}
            </Text>
          </View>

          <Pressable
            style={{
              backgroundColor: COLORS.lightPrimary,
              borderRadius: 20,
              padding: 8,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../../assets/icons/auction1.png")}
              style={{ width: 24, height: 24 }}
            />
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LikeCard;

const styles = StyleSheet.create({});
