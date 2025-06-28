import { BidType } from "@/types/auction/bid.type";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const windowHeight = Dimensions.get("window").height;

import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation/rootStack.type";
import utils from "@/core/utils";

type BidHistoryRouteProp = RouteProp<RootStackParamList, "BidHistory">;

const BidHistory = () => {
  const route = useRoute<BidHistoryRouteProp>();
  const { bids } = route.params;
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [allBids, setAllBids] = useState<BidType[]>(bids);

  // Generate more bids for the full history
  // useEffect(() => {
  //   const generateBids = () => {
  //     const bidders = [
  //       {
  //         name: "Emma Thompson",
  //         avatar:
  //           "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20woman%20with%20blonde%20hair%2C%20warm%20smile%2C%20natural%20makeup%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=5&orientation=squarish",
  //       },
  //       {
  //         name: "Michael Chen",
  //         avatar:
  //           "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20an%20Asian%20man%20in%20his%2030s%2C%20wearing%20business%20attire%2C%20confident%20expression%2C%20clean%20background%2C%20high%20quality%20portrait%2C%20studio%20lighting&width=50&height=50&seq=6&orientation=squarish",
  //       },
  //       {
  //         name: "Sarah Miller",
  //         avatar:
  //           "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20woman%20with%20brown%20hair%2C%20professional%20appearance%2C%20natural%20smile%2C%20simple%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=7&orientation=squarish",
  //       },
  //       {
  //         name: "David Wilson",
  //         avatar:
  //           "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20middle-aged%20man%20with%20short%20dark%20hair%2C%20friendly%20smile%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=8&orientation=squarish",
  //       },
  //       {
  //         name: "Jessica Park",
  //         avatar:
  //           "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20an%20Asian%20woman%20with%20long%20black%20hair%2C%20professional%20appearance%2C%20warm%20smile%2C%20simple%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=9&orientation=squarish",
  //       },
  //       {
  //         name: "Robert Johnson",
  //         avatar:
  //           "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20an%20African%20American%20man%20with%20short%20hair%2C%20confident%20expression%2C%20business%20attire%2C%20clean%20background%2C%20high%20quality%20portrait%2C%20studio%20lighting&width=50&height=50&seq=10&orientation=squarish",
  //       },
  //     ];

  //     // Recent bids from the original page
  //     const recentBids = [
  //       {
  //         id: 1,
  //         bidder: bidders[0],
  //         amount: 6.0,
  //         timestamp: "2025-06-24T10:30:00",
  //         isCurrentUser: false,
  //       },
  //       {
  //         id: 2,
  //         bidder: bidders[1],
  //         amount: 5.5,
  //         timestamp: "2025-06-24T09:15:00",
  //         isCurrentUser: true,
  //       },
  //       {
  //         id: 3,
  //         bidder: bidders[2],
  //         amount: 5.0,
  //         timestamp: "2025-06-24T08:45:00",
  //         isCurrentUser: false,
  //       },
  //     ];

  //     // Additional historical bids
  //     const historicalBids = [
  //       {
  //         id: 4,
  //         bidder: bidders[3],
  //         amount: 4.5,
  //         timestamp: "2025-06-24T07:20:00",
  //         isCurrentUser: false,
  //       },
  //       {
  //         id: 5,
  //         bidder: bidders[1], // Michael Chen (current user)
  //         amount: 4.0,
  //         timestamp: "2025-06-24T06:45:00",
  //         isCurrentUser: true,
  //       },
  //       {
  //         id: 6,
  //         bidder: bidders[4],
  //         amount: 3.5,
  //         timestamp: "2025-06-23T22:10:00",
  //         isCurrentUser: false,
  //       },
  //       {
  //         id: 7,
  //         bidder: bidders[5],
  //         amount: 3.0,
  //         timestamp: "2025-06-23T19:30:00",
  //         isCurrentUser: false,
  //       },
  //       {
  //         id: 8,
  //         bidder: bidders[2],
  //         amount: 2.5,
  //         timestamp: "2025-06-23T15:45:00",
  //         isCurrentUser: false,
  //       },
  //       {
  //         id: 9,
  //         bidder: bidders[1], // Michael Chen (current user)
  //         amount: 2.0,
  //         timestamp: "2025-06-23T12:20:00",
  //         isCurrentUser: true,
  //         status: "Outbid",
  //       },
  //       {
  //         id: 10,
  //         bidder: bidders[0],
  //         amount: 1.5,
  //         timestamp: "2025-06-23T10:05:00",
  //         isCurrentUser: false,
  //         status: "Outbid",
  //       },
  //       {
  //         id: 11,
  //         bidder: bidders[3],
  //         amount: 1.0,
  //         timestamp: "2025-06-23T09:15:00",
  //         isCurrentUser: false,
  //         status: "Outbid",
  //       },
  //       {
  //         id: 12,
  //         bidder: bidders[4],
  //         amount: 0.5,
  //         timestamp: "2025-06-23T08:30:00",
  //         isCurrentUser: false,
  //         status: "Outbid",
  //       },
  //     ];

  //     return [...recentBids, ...historicalBids];
  //   };

  //   setAllBids(generateBids());
  // }, []);

  // Sort bids based on selected order
  // const sortedBids = [...allBids].sort((a, b) => {
  //   switch (sortOrder) {
  //     case "newest":
  //       return (
  //         new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  //       );
  //     case "oldest":
  //       return (
  //         new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  //       );
  //     case "highest":
  //       return b.amount - a.amount;
  //     case "lowest":
  //       return a.amount - b.amount;
  //     default:
  //       return 0;
  //   }
  // });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Check if the date is yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Otherwise, show the full date
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderBidItem = ({ item }) => (
    <View
      style={[
        styles.bidItem,
        item.isCurrentUser ? styles.currentUserBg : styles.defaultBg,
      ]}
    >
      <View style={styles.row}>
        {/* Avatar and user info */}
        <View style={styles.userInfo}>
          <Image
            source={utils.thumbnail(item.bidder.thumbnail)}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{item.bidder.name}</Text>
              {item.isCurrentUser && <Text style={styles.youBadge}> You </Text>}
            </View>
            <Text style={styles.timestamp}>{formatDate(item.placed_at)}</Text>
          </View>
        </View>

        {/* Amount and status */}
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.amount}>₦{item.amount}</Text>
          {item.status && <Text style={styles.status}>{item.status}</Text>}
        </View>
      </View>
    </View>
  );
  // const sortedBids = [];
  return bids.length > 0 ? (
    <FlatList
      data={bids}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={renderBidItem}
    />
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔨</Text>
      <Text style={styles.emptyTitle}>No bids yet</Text>
      <Text style={styles.emptyText}>
        Be the first to place a bid on this MacBook Pro
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 12,
  },
  bidItem: {
    padding: 12,
    borderRadius: 12,
    elevation: 1,
  },
  currentUserBg: {
    backgroundColor: "#ecfdf5",
  },
  defaultBg: {
    backgroundColor: "#f9fafb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  youBadge: {
    fontSize: 11,
    backgroundColor: "#bbf7d0",
    color: "#047857",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
    marginLeft: 6,
  },
  timestamp: {
    fontSize: 12,
    color: "#6b7280",
  },
  amount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16a34a",
  },
  status: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyContainer: {
    height: windowHeight - 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 48,
    color: "#9ca3af",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
  },
});

export default BidHistory;
