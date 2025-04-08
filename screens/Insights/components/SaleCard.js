import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";
import { useNavigation } from "@react-navigation/native";

const SaleCard = ({ auction }) => {
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
            {auction.date_created}
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
          {auction.price}
        </Text>

        {/* Status Badge - Centered */}
        <View style={{ alignSelf: "flex-start" }}>
          <View
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor:
                auction.status === "Sold" ? COLORS.red : COLORS.yellow,
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
              {auction.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SaleCard;

const styles = StyleSheet.create({});
