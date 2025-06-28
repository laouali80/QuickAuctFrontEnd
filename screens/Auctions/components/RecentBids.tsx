import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BidType } from "@/types/auction/bid.type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation/rootStack.type";
import utils from "@/core/utils";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BidHistory"
>;

type RecentBidsProps = {
  bids: BidType[];
  onSubmitBid: (amount: number) => void;
  myBid: BidType | null;
};

const RecentBids = ({ bids, myBid, onSubmitBid }: RecentBidsProps) => {
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const navigation = useNavigation<NavigationProp>();

  // useMemo helps avoid recalculating unless bids or myBid changes.
  const sortedBids: BidType[] = useMemo(() => {
    const sorted = bids;

    if (!myBid) {
      return sorted.slice(0, 3);
    }

    // Check if myBid is already in the top 3
    const top3 = sorted.slice(0, 3);
    const isMyBidInTop3 = top3.some((bid) => bid.id === myBid.id);

    if (isMyBidInTop3) {
      return top3;
    }

    // Force include myBid by replacing the lowest of the top 3
    const top2 = top3.slice(0, 2);
    const combined = [...top2, myBid];

    // Ensure uniqueness
    const unique = combined.filter(
      (bid, i, self) => i === self.findIndex((b) => b.id === bid.id)
    );

    return unique.sort((a, b) => parseInt(b.amount) - parseInt(a.amount));
  }, [bids, myBid]);
  // console.log("sorted: ", bids);
  const handleBidSubmit = () => {
    if (bidAmount) {
      onSubmitBid(parseFloat(bidAmount));
      setBidAmount("");
      setShowBidForm(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Bids</Text>

      {sortedBids.length > 0 ? (
        <FlatList
          data={sortedBids}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bidItem,
                item.isCurrentUser && styles.currentUserBid,
              ]}
            >
              <View style={styles.bidContent}>
                <View style={styles.bidderInfo}>
                  <Image
                    source={utils.thumbnail(item.bidder.thumbnail)}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.bidderName}>
                      {item.bidder.name}
                      {item.isCurrentUser && (
                        <Text style={styles.youTag}> (You)</Text>
                      )}
                    </Text>
                    <Text style={styles.timestamp}>
                      {new Date(item.placed_at).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.amount}>₦{item.amount}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔨</Text>
          <Text style={styles.emptyText}>No bids have been placed yet</Text>
          <Text style={styles.emptySubtext}>
            Be the first one to place a bid!
          </Text>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        {sortedBids.length > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate("BidHistory", { bids: bids })}
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryBtnText}>View Full Bid History</Text>
          </TouchableOpacity>
        )}

        {!showBidForm ? (
          <TouchableOpacity
            onPress={() => setShowBidForm(true)}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Place a Jump Bid</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.inputWrapper}>
              <Text style={styles.currency}>₦</Text>
              <TextInput
                value={bidAmount}
                onChangeText={setBidAmount}
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="Enter bid amount"
              />
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={handleBidSubmit}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>Submit Bid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowBidForm(false)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  bidItem: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
  },
  currentUserBid: {
    backgroundColor: "#ecfdf5",
  },
  bidContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bidderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  bidderName: { fontWeight: "500", fontSize: 14 },
  youTag: { color: "#059669", fontSize: 12 },
  timestamp: { fontSize: 12, color: "#6b7280" },
  amount: { fontWeight: "600", color: "#059669" },

  emptyState: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyIcon: { fontSize: 40, color: "#9ca3af" },
  emptyText: { fontSize: 16, color: "#4b5563" },
  emptySubtext: { fontSize: 13, color: "#6b7280" },

  primaryBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: "white", fontWeight: "600" },
  secondaryBtn: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryBtnText: { color: "#374151", fontWeight: "600" },

  inputWrapper: {
    position: "relative",
    marginTop: 10,
  },
  currency: {
    position: "absolute",
    left: 10,
    top: 12,
    color: "#6b7280",
  },
  input: {
    paddingLeft: 24,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 10,
    paddingRight: 10,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});

export default RecentBids;
