import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "@/core/utils";
import Thumbnail from "@/common_components/Thumbnail";

const SaleCard = ({ auction }) => {
  const navigation = useNavigation();
  const _navigate = () => {
    navigation.navigate("Auction", {id: auction.id,  listType:'sales'});
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
        <Thumbnail
          url={auction.images[0].image}
          width={120}
          height={100}
          borderRadius={10}
        />
      </View>

      {/* Content Container */}
      <View style={{ flex: 1 }}>
        {/* Title and Date Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
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
          <Text
            style={{
              color: COLORS.silverIcon,
              fontSize: 12,
              alignSelf: "flex-end",
            }}
          >
            {formatDate(auction.updated_at)}
          </Text>
        </View>

        {/* Price */}
        <Text
          style={{
            color: COLORS.primary,
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          {auction.current_price}
        </Text>

        {/* Status Badge - Centered */}
        <View style={{ alignSelf: "flex-start" }}>
          <View
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor:
                auction.status === "completed" && auction.winner
                  ? COLORS.primary
                  : COLORS.yellow,
              // auction.status === "completed" && auction.winner ? COLORS.red : COLORS.yellow,
              alignSelf: "flex-start", // Aligns to left but can be changed to 'center' if needed
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                color: "white",
                fontSize: 12,
              }}
            >
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SaleCard;

const styles = StyleSheet.create({});
