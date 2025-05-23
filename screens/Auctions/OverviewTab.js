import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const OverviewTab = ({ auction }) => {
  const [showFullOverview, setShowFullOverview] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Auction Details</Text>
      <View style={styles.detailGrid}>
        {[
          ["Starting Price", `N${auction.starting_price}`],
          ["Jump Bid", `N${auction.bid_increment}`],
          ["Duration", "7 days"],
          ["Condition", `${auction.item_condition}`],
          //   Used - Like New
        ].map(([label, value]) => (
          <View key={label} style={styles.detailItem}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text
        style={styles.description}
        numberOfLines={showFullOverview ? undefined : 3}
      >
        {auction.description}
        {/* MacBook Pro 2023, M2 Pro chip with 12-core CPU and 19-core GPU, 16GB
        unified memory, 512GB SSD storage. Perfect for professionals and
        creatives. Minor signs of use, fully functional with original
        accessories included. This device has excellent battery life, a
        beautiful Retina display, and comes with a charger and original
        packaging. Ideal for students, developers, or anyone in need of a
        powerful laptop. */}
      </Text>

      {!showFullOverview && (
        <TouchableOpacity onPress={() => setShowFullOverview(true)}>
          <Text style={styles.readMore}>...Read More</Text>
        </TouchableOpacity>
      )}

      {showFullOverview && (
        <>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.tagRow}>
            {["Pickup", "Standard Shipping", "Express Delivery"].map((opt) => (
              <Text key={opt} style={styles.deliveryTag}>
                {opt}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Payment Methods</Text>

          <View style={styles.paymentGrid}>
            {[
              ["money", "Cash"],
              ["university", "Bank Transfer"],
              ["paypal", "PayPal"],
              ["apple", "Apple Pay"],
              ["credit-card", "Debit Card"],
              ["ellipsis-h", "Others"],
            ]
              .filter(([_, label]) => auction.payment_methods.includes(label))
              .map(([icon, label]) => (
                <View key={label} style={styles.paymentMethod}>
                  <Icon name={icon} size={16} color="#666" />
                  <Text>{label}</Text>
                </View>
              ))}
          </View>

          <TouchableOpacity onPress={() => setShowFullOverview(false)}>
            <Text style={styles.readMore}>Show Less</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default OverviewTab;

const styles = StyleSheet.create({
  section: { padding: 16 },
  sectionTitle: { fontWeight: "600", fontSize: 16, marginVertical: 8 },
  detailGrid: { flexDirection: "row", flexWrap: "wrap" },
  detailItem: { width: "50%", marginBottom: 12 },
  detailLabel: { fontSize: 13, color: "#666" },
  detailValue: { fontSize: 14, fontWeight: "500" },
  description: { fontSize: 14, color: "#444", marginVertical: 4 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  deliveryTag: {
    backgroundColor: "#ecfdf5",
    color: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 14,
  },
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "45%",
  },

  readMore: {
    color: "#22c55e",
    fontWeight: "500",
    marginTop: 8,
  },
});
