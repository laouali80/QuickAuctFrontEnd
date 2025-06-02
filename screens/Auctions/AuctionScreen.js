import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";

import {
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import utils, { formatAuctionTime } from "@/core/utils";
import RatingModal from "./components/RatingModal";
import ReportModal from "./components/ReportModal";
import {
  _navigateToChat,
  handleLike,
  handleRatingSubmit,
  makeCall,
} from "./handlers/auctionHandlers";
import Icon from "react-native-vector-icons/FontAwesome";
import OverviewTab from "./OverviewTab";
import renderThumbnail from "./components/renderThumbnail";
import { useSelector } from "react-redux";
import { getUserInfo } from "@/state/reducers/userSlice";
import SubmitButton from "@/common_components/SubmitButton";

const { width } = Dimensions.get("window");

const AuctionScreen = ({ navigation, route }) => {
  // -------------------- Navigation Parameters --------------------
  // const { id } = route.params;
  const auction = route.params;

  // -------------------- Redux State --------------------
  // const auction = useSelector(getAuction(id));
  const user = useSelector(getUserInfo);

  // -------------------- Local State --------------------
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [like, setLike] = useState("heart-o");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(true); // trigger this when auction is won
  const images = auction.images
    .filter((img) => img && img.image)
    .map((img) => img.image);

  // mock images
  // const images = [
  //   require("../../assets/auctions/auct1.jpg"),
  //   require("../../assets/auctions/auct2.jpg"),
  //   require("../../assets/auctions/auct3.jpg"),
  // ];

  // console.log(images);

  // // -------------------- Debugs --------------------
  // console.log("auction receive: ", auction?.timeLeft);

  // -------------------- Effects --------------------
  // set up Screen header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Auction",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={navigation.goBack}
          // style={{ paddingLeft: 3 }}
        >
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowReportModal(true)}
          // style={{ paddingRight: 5 }}
        >
          <MaterialIcons
            name="report-gmailerrorred"
            size={30}
            color={COLORS.yellow}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (auction?.watchers?.includes(user.userId)) {
      setLike("heart");
    } else {
      setLike("heart-o");
    }
  }, [auction?.watchers, user.userId]);

  // // -------------------- Render --------------------

  // const renderThumbnail = ({ item, index }) => (
  //   <TouchableOpacity
  //     key={index}
  //     onPress={() => setCurrentImageIndex(index)}
  //     style={[
  //       styles.thumbnail,
  //       currentImageIndex === index && styles.thumbnailActive,
  //     ]}
  //   >
  //     {/* <Image source={{ uri: item }} style={styles.thumbnailImage} /> */}
  //     <Image source={utils.thumbnail(item)} style={styles.thumbnailImage} />
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View>
          {/* <Image
            source={{ uri: images[currentImageIndex] }}
            style={styles.mainImage}
          /> */}
          <Image
            source={utils.thumbnail(images[currentImageIndex])}
            style={styles.mainImage}
          />
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>
              {currentImageIndex + 1} / {images.length}
            </Text>
          </View>
          <FlatList
            data={images}
            renderItem={({ item, index }) =>
              renderThumbnail({
                item,
                index,
                currentImageIndex,
                setCurrentImageIndex,
              })
            }
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
          />
        </View>

        {/* Auction Info */}
        <View style={styles.row}>
          <View>
            <Text style={styles.price}>N{auction?.current_price}</Text>
            <Text style={styles.subText}>Current Bid</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.timer}>{auction?.timeLeft}</Text>
            <Text style={styles.subText}>Ends In</Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.productRow}>
          <View style={styles.productTitle}>
            <Text
              style={styles.productName}
              numberOfLines={1} // Prevent text overflow
              ellipsizeMode="tail"
            >
              {auction?.title}
            </Text>
            <Text style={styles.categoryTag}>{auction?.category.value}</Text>
          </View>
          <TouchableOpacity onPress={() => handleLike(like, setLike, auction)}>
            <FontAwesome name={like} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerRow}>
          <View style={styles.sellerLeft}>
            <Image
              source={utils.thumbnail(auction?.seller?.thumbnail)}
              style={styles.sellerImage}
            />
            <View>
              <Text style={styles.sellerName}>
                {auction?.seller?.username || "Unknown"}
              </Text>

              {/* Seller Rating */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 2,
                }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icon
                    key={i}
                    name={
                      i <= (auction?.seller?.rating || 0) ? "star" : "star-o"
                    }
                    size={14}
                    color="#FFD700"
                  />
                ))}
                <Text style={{ marginLeft: 4, fontSize: 12 }}>
                  {auction?.seller?.rating?.toFixed(1) || "0.0"}
                </Text>
              </View>

              <Text style={styles.sellerLocation}>
                <Icon name="map-marker" size={24} color={COLORS.primary} />
                {auction?.seller?.location || "Unknown, Uknown"}
              </Text>
            </View>
          </View>

          {/* Right Side: Condition & Delivery */}
          <View
            style={{ justifyContent: "center", alignItems: "flex-end", gap: 4 }}
          >
            <Text style={styles.condition}>
              {auction?.item_condition || "Used"}
            </Text>
            <Text style={styles.delivery}>
              {auction?.shipping_details || "Pickup"}
            </Text>
          </View>
        </View>

        {/* Call or Chat with Owner */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 16,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.lightPrimary,
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
              }}
              onPress={() => _navigateToChat(navigation, auction)}
            >
              <Ionicons
                name="chatbox-outline"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 14, fontWeight: "600" }}>Chat</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.lightRed,
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
              }}
              onPress={() => makeCall(auction?.seller?.phone_number)}
            >
              <Feather name="phone-call" size={24} color={COLORS.red} />
            </TouchableOpacity>
            <Text style={{ fontSize: 14, fontWeight: "600" }}>Call</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {["Overview", "Bids", "Options"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === "Overview" && <OverviewTab auction={auction} />}

        {activeTab === "Bids" && (
          <View style={styles.section}>
            <Text style={styles.description}>
              No bids have been placed yet.
            </Text>
          </View>
        )}
        {activeTab === "Options" && (
          <View style={styles.section}>
            <Text style={styles.description}>
              Additional options for this product.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bidButton}>
          <Text
            style={styles.bidButtonText}
          >{`Bid N${auction.bid_increment}`}</Text>
          {/* <SubmitButton text={`Bid N${auction.bid_increment}`} /> */}
        </TouchableOpacity>
      </View>

      {showReportModal && (
        <ReportModal
          visible={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={(data) => {
            data["auctionId"] = auction.id;
            data["offender"] = auction.seller.userId;

            console.log("Report Submitted:", data);
            // Send to backend here
          }}
        />
      )}

      {showRatingModal && (
        <RatingModal
          visible={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          auction={auction}
        />
      )}
    </View>
  );
};

export default AuctionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mainImage: { width: "100%", height: 250 },
  pagination: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#0009",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paginationText: { color: "#fff", fontSize: 12 },
  thumbnailList: { paddingHorizontal: 10, paddingTop: 10 },
  thumbnail: {
    width: 64,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailActive: {
    borderColor: "#22c55e",
  },
  thumbnailImage: { width: "100%", height: "100%", resizeMode: "cover" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  price: { color: "#22c55e", fontSize: 20, fontWeight: "bold" },
  timer: { fontSize: 16, fontWeight: "500" },
  subText: { fontSize: 12, color: "#888" },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  productTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  productName: { fontSize: 18, fontWeight: "500" },
  categoryTag: {
    fontSize: 12,
    backgroundColor: "#d1fae5",
    color: "#15803d",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  sellerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  sellerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  sellerImage: { width: 48, height: 48, borderRadius: 24 },
  sellerName: { fontWeight: "600", color: "#15803d" },
  sellerLocation: { fontSize: 12, color: "#666" },
  condition: { color: "#f97316", fontSize: 14 },
  delivery: { fontSize: 12, color: "#15803d" },
  tabsRow: {
    flexDirection: "row",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  tabButton: { flex: 1, paddingVertical: 12 },
  tabText: { textAlign: "center", fontSize: 14, color: "#888" },
  activeTab: { borderBottomColor: "#22c55e", borderBottomWidth: 2 },
  activeTabText: { color: "#22c55e" },
  section: { padding: 16 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopColor: "#eee",
    borderTopWidth: 1,
    backgroundColor: "#fff",
  },
  bidButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 8,
  },
  bidButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
