import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";
import utils from "@/core/utils";

const MessageBubbleMe = ({ content, created, auction, onViewAuction }) => {
  // const auction = {
  //   id: "e5aeb497-7d36-4b4b-98c9-7db5affcab91",
  //   title: "dfdf",
  //   description: "dfdfd",
  //   starting_price: "45454.00",
  //   current_price: "45454.00",
  //   bid_increment: "1000.00",
  //   status: "ongoing",
  //   seller: {
  //     userId: "8ef0d504-427f-456c-af18-8414544fa819",
  //     first_name: "work",
  //     last_name: "work",
  //     name: "Work Work",
  //     username: "user_fe7238",
  //     email: "work@gmail.com",
  //     phone_number: "0988843",
  //     thumbnail: "/media/thumbnails/03124731c0fbb589.jpg",
  //     latest_location: null,
  //     address: "",
  //   },
  //   winner: null,
  //   category: {
  //     key: 1,
  //     value: "art",
  //   },
  //   watchers: [],
  //   start_time: "2025-07-19T00:11:06.793516+01:00",
  //   end_time: "2025-07-23T00:11:05.792966+01:00",
  //   created_at: "2025-07-19T00:11:06.794609+01:00",
  //   updated_at: "2025-07-19T00:11:06.799680+01:00",
  //   shipping_details: "Pickup",
  //   payment_methods: ["Bank Transfer"],
  //   item_condition: "used",
  //   images: [
  //     {
  //       id: 2,
  //       image: "/media/auction_images/dd92cdd18846341d.jpg",
  //       image_url: "/media/auction_images/dd92cdd18846341d.jpg",
  //       is_primary: true,
  //       uploaded_at: "2025-07-19T00:11:06.806508+01:00",
  //     },
  //   ],
  //   bids: [],
  //   highest_bid: null,
  //   duration: "3 days",
  //   is_active: true,
  //   has_ended: false,
  //   user_bid: null,
  //   timeLeft: "3:9:9:45s",
  //   lastUpdated: 1752933680510,
  // };

  // const auction = null;

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingRight: 16,
      }}
    >
      <View style={{ flex: 1 }} />
      <View
        style={[
          {
            backgroundColor: COLORS.meBubble,
            borderRadius: 21,
            minWidth: "40%",
            maxWidth: "75%",
            paddingHorizontal: 16,
            paddingVertical: 12,
            justifyContent: "center",
            marginRight: 8,
            minHeight: 42,
            flexDirection: "column",
            alignItems: "flex-end",
          },
          auction && { flex: 2 }, // Only apply flex: 2 when auction is present
        ]}
      >
        {/* Auction Reply Preview */}
        {auction && (
          <View style={styles.auctionPreviewContainer}>
            <View style={styles.leftMark} />
            <View style={styles.auctionContent}>
              <Image
                source={utils.thumbnail(auction.images?.[0]?.image)}
                style={styles.auctionImage}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.auctionTitle} numberOfLines={1}>
                  {auction.title}
                </Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => onViewAuction && onViewAuction(auction)}
                >
                  <Text style={styles.viewButtonText}>View Auction</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Message Content */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <Text
            style={{
              color: COLORS.contentText,
              fontSize: 18,
              lineHeight: 30,
              fontWeight: "medium",
              flexShrink: 1,
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            {content}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              color: COLORS.dateText,
              fontSize: 11,
              alignSelf: "flex-end",
            }}
          >
            {new Date(created).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  auctionPreviewContainer: {
    flexDirection: "row",
    height: 80,
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  leftMark: {
    width: 5,
    height: "100%",
    backgroundColor: COLORS.primary, // keep as primary for strong accent
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  auctionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: 6,
  },
  auctionImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: COLORS.lightPrimary,
  },
  auctionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 2,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
});

export default MessageBubbleMe;
