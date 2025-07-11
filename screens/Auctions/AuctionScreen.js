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
  submitReport,
} from "./handlers/auctionHandlers";
import Icon from "react-native-vector-icons/FontAwesome";
import OverviewTab from "./OverviewTab";
import renderThumbnail from "./components/renderThumbnail";
import { useDispatch, useSelector } from "react-redux";
import { getMessage, getStatus, getUserInfo } from "@/state/reducers/userSlice";
import SubmitButton from "@/common_components/SubmitButton";
import RecentBids from "./components/RecentBids";
import {
  clearAuctionMessage,
  deleteAuction,
  getAuctionMessage,
  getAuctionStatus,
  updateTime,
} from "@/state/reducers/auctionsSlice";
import DeleteModal from "./components/DeleteModal";
import { showToast } from "@/animation/CustomToast/ToastManager";
// import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const AuctionScreen = ({ navigation, route }) => {
  // -------------------- Navigation Parameters --------------------
  // const { id } = route.params;
  const auction = route.params;
  console.log('auction: ', auction);
  

  // -------------------- Redux State --------------------
  // const auction = useSelector(getAuction(id));
  const user = useSelector(getUserInfo);
  const dispatch = useDispatch(); // Get dispatch function
  const isCurrentUser = auction.seller.userId === user.userId;
  // console.log("auction: ", isCurrentUser);
  // -------------------- Local State --------------------
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [like, setLike] = useState("heart-o");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false); // trigger this when auction is won
  const [showDeleteModal, setDeleteModal] = useState(false); // trigger this when auction is won
  const images = auction.images
    .filter((img) => img && img.image)
    .map((img) => img.image);

  // const bids = [
  //   {
  //     id: 1,
  //     bidder: {
  //       name: "Emma Thompson",
  //       avatar:
  //         "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20woman%20with%20blonde%20hair%2C%20warm%20smile%2C%20natural%20makeup%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=5&orientation=squarish",
  //     },
  //     amount: 6.0,
  //     timestamp: "2025-06-24T10:30:00",
  //     isCurrentUser: false,
  //   },
  //   {
  //     id: 2,
  //     bidder: {
  //       name: "Michael Chen",
  //       avatar:
  //         "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20an%20Asian%20man%20in%20his%2030s%2C%20wearing%20business%20attire%2C%20confident%20expression%2C%20clean%20background%2C%20high%20quality%20portrait%2C%20studio%20lighting&width=50&height=50&seq=6&orientation=squarish",
  //     },
  //     amount: 5.5,
  //     timestamp: "2025-06-24T09:15:00",
  //     isCurrentUser: false,
  //   },
  //   {
  //     id: 3,
  //     bidder: {
  //       name: "Sarah Miller",
  //       avatar:
  //         "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20woman%20with%20brown%20hair%2C%20professional%20appearance%2C%20natural%20smile%2C%20simple%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=7&orientation=squarish",
  //     },
  //     amount: 5.0,
  //     timestamp: "2025-06-24T08:45:00",
  //     isCurrentUser: false,
  //   },
  //   {
  //     id: 4,
  //     bidder: {
  //       name: "Test Miller",
  //       avatar:
  //         "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20woman%20with%20brown%20hair%2C%20professional%20appearance%2C%20natural%20smile%2C%20simple%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=7&orientation=squarish",
  //     },
  //     amount: 2.0,
  //     timestamp: "2025-06-24T08:45:00",
  //     isCurrentUser: true,
  //   },
  // ];
  // const myBid = {
  //   id: 4,
  //   bidder: {
  //     name: "Test Miller",
  //     avatar:
  //       "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20woman%20with%20brown%20hair%2C%20professional%20appearance%2C%20natural%20smile%2C%20simple%20background%2C%20high%20quality%20portrait%2C%20soft%20lighting&width=50&height=50&seq=7&orientation=squarish",
  //   },
  //   amount: 2.0,
  //   timestamp: "2025-06-24T08:45:00",
  //   isCurrentUser: true,
  // };
  // const bids = [];

  // mock images
  // const images = [
  //   require("../../assets/auctions/auct1.jpg"),
  // require("../../assets/auctions/auct2.jpg"),
  // require("../../assets/auctions/auct3.jpg"),
  // ];

  // console.log("response: ", utils.thumbnail(images[currentImageIndex]));

  // // -------------------- Debugs --------------------
  // console.log("auction receive: ", auction?.timeLeft);

  // -------------------- Effects --------------------
  // set up Screen header

  // Timer for auction time updates
  useEffect(() => {
    const interval = setInterval(() => dispatch(updateTime()), 1000);
    return () => clearInterval(interval);
  }, []);

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
      headerRight: () =>
        !isCurrentUser ? (
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
        ) : null,
    });
  }, [navigation]);

  useEffect(() => {
    if (auction?.watchers?.includes(user.userId)) {
      setLike("heart");
    } else {
      setLike("heart-o");
    }
  }, [auction?.watchers, user.userId]);

  
  const ReportMssg = useSelector(getMessage);
  const ReportStatus = useSelector(getStatus);

  useEffect(() => {
    if (!ReportMssg || !ReportStatus) return;
    if (ReportMssg) {
      showToast({
        text: ReportMssg,
        duration: 2000,
        type: ReportStatus,
      });
    }
    if (ReportStatus === "success") {
      setTimeout(() => {
        dispatch(setAuthenticated(true)); // separate action to update auth state
      }, 2000); // wait for toast to show before navigating
    }

    dispatch(clearMessage());
  }, [ReportMssg, ReportStatus]);

  const AuctionMssg = useSelector(getAuctionMessage);
  const AuctionStatus = useSelector(getAuctionStatus);

  // console.log("auction scre: ", AuctionMssg, AuctionStatus);

  useEffect(() => {
    if (!AuctionMssg || !AuctionStatus) return;
    if (AuctionMssg) {
      showToast({
        text: AuctionMssg,
        duration: 2000,
        type: AuctionStatus,
      });
    }
    if (AuctionStatus === "success") {
      setTimeout(() => {
        navigation.navigate("Home", { screen: "Insights" }); // separate action to update auth state
      }, 2000); // wait for toast to show before navigating
    }

    dispatch(clearAuctionMessage());
  }, [AuctionMssg, AuctionStatus]);
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

  const handleDelete = () => {
    deleteAuction({ auction_id: auction.id });
    setDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View>
          <Image
            source={utils.thumbnail(images[currentImageIndex])}
            style={styles.mainImage}
          />
          <View className="flex">
            <View style={styles.pagination}>
              <Text style={styles.paginationText}>
                {currentImageIndex + 1} / {images.length}
              </Text>
            </View>
            <View className="flex-1">
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
                style={{ alignSelf: "center" }} // This helps center the whole list container
              />
            </View>
          </View>
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
          {!isCurrentUser ? (
            <TouchableOpacity
              onPress={() => handleLike(like, setLike, auction)}
            >
              <FontAwesome name={like} size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null}
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
        {!isCurrentUser ? (
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
        ) : null}

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {["Overview", "Bids"].map((tab) => (
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
          <RecentBids auction={auction} myBid={auction.user_bid} />
        )}
      </ScrollView>

      {/* <TouchableOpacity style={styles.bidButton} disabled={true}>
          <Text
            style={styles.bidButtonText}
          >{`Bid N${auction.bid_increment}`}</Text>
        </TouchableOpacity> */}

      {/* Bottom Button */}

      {isCurrentUser &&
        (auction.has_ended ? (
          <View style={{ flexDirection: "row", padding: 16, gap: 10 }}>
            <TouchableOpacity
              // onPress={handleEdit}
              style={{
                backgroundColor: "#22c55e",
                paddingVertical: 12,
                borderRadius: 8,
                flex: 1,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteModal(true)}
              style={{
                backgroundColor: COLORS.red,
                paddingVertical: 12,
                borderRadius: 8,
                flex: 1,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#374151", fontWeight: "600" }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
            <SubmitButton text="Close" className="py-4" />
          </View>
        ))}

      {!isCurrentUser && (
        <View style={styles.footer}>
          <SubmitButton
            text={`Bid N${auction.bid_increment}`}
            isDisabled={auction.has_ended}
            className="py-4"
          />
        </View>
      )}

      {showReportModal && (
        <ReportModal
          visible={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={(data) => submitReport({ ...data, auction_id: auction.id })}
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
      {showDeleteModal && (
        <DeleteModal
          visible={showDeleteModal}
          onClose={() => setDeleteModal(false)}
          onSubmit={handleDelete}
        />
      )}
      {/* <LottieView
        source={require("../../assets/animation/confetti.json")}
        autoPlay
        loop
      /> */}
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
  thumbnailList: {
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 8,
    flexDirection: "row",
    justifyContent: "center", // center items horizontally
    alignItems: "center", // center items vertically
  },
  thumbnail: {
    width: 64,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },

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
