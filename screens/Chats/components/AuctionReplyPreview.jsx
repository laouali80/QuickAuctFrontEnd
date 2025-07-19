import utils from "@/core/utils";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const AuctionReplyPreview = ({ auction, onViewAuction, onClose }) => (
  <View style={styles.container}>
    <Image
      source={utils.thumbnail(auction.images[0]?.image)}
      style={styles.image}
    />
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={1}>
        {auction.title}
      </Text>

      <TouchableOpacity onPress={onViewAuction} style={styles.button}>
        <Text style={styles.buttonText}>View Auction</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onClose}>
      <Text style={styles.close}>×</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    margin: 8,
    padding: 8,
  },
  image: { width: 50, height: 50, borderRadius: 6, marginRight: 8 },
  info: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 16 },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    maxWidth: "30%",
  },
  buttonText: { color: "#fff", fontSize: 12, alignSelf: "center" },
  close: { fontSize: 20, color: "#888", marginLeft: 8 },
});

export default AuctionReplyPreview;
