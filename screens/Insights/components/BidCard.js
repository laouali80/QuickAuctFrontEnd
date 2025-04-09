import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";
import { useNavigation } from "@react-navigation/native";

const BidCard = ({ auction }) => {
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
        alignItems: "center", // Ensures vertical alignment of all items
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
            resizeMode: "cover", // Ensures consistent image aspect ratio
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

        {/* Bid and Status Row */}
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

          <View
            style={{
              alignItems: "center", // Changed from 'flex-end' to 'center'
              justifyContent: "center",
            }}
          >
            {auction.status === "Won" && (
              <Image
                source={require("../../../assets/icons/win.png")}
                style={{
                  width: 30,
                  height: 30,
                  marginBottom: 4,
                }}
              />
            )}
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor:
                  auction.status === "Won"
                    ? COLORS.lightYellow
                    : auction.status === "Bid Lost"
                    ? COLORS.lightRed
                    : COLORS.lightPrimary,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 12,
                  color:
                    auction.status === "Won"
                      ? COLORS.yellow
                      : auction.status === "Bid Lost"
                      ? COLORS.red
                      : COLORS.primary,
                }}
              >
                {auction.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BidCard;

const styles = StyleSheet.create({});
