import React, { useState } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const App = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(true);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const images = [
    require("../../assets/auctions/auct1.jpg"),
    require("../../assets/auctions/auct2.jpg"),
    require("../../assets/auctions/auct3.jpg"),
  ];

  const renderThumbnail = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      onPress={() => setCurrentImageIndex(index)}
      style={[
        styles.thumbnail,
        currentImageIndex === index && styles.thumbnailActive,
      ]}
    >
      {/* <Image source={{ uri: item }} style={styles.thumbnailImage} /> */}
      <Image source={item} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View>
          {/* <Image
            source={{ uri: images[currentImageIndex] }}
            style={styles.mainImage}
          /> */}
          <Image source={images[currentImageIndex]} style={styles.mainImage} />
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>
              {currentImageIndex + 1} / {images.length}
            </Text>
          </View>
          <FlatList
            data={images}
            renderItem={renderThumbnail}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
          />
        </View>

        {/* Auction Info */}
        <View style={styles.row}>
          <View>
            <Text style={styles.price}>$6.00</Text>
            <Text style={styles.subText}>Current Bid</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.timer}>28:32:12</Text>
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
              MacBook
            </Text>
            <Text style={styles.categoryTag}>Electronics</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Icon
              name="heart"
              size={24}
              color={isFavorite ? "#22c55e" : "#ccc"}
            />
          </TouchableOpacity>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerRow}>
          <View style={styles.sellerLeft}>
            <Image
              source={{
                uri: "https://readdy.ai/api/search-image?query=Professional%20headshot...&width=100&height=100",
              }}
              style={styles.sellerImage}
            />
            <View>
              <Text style={styles.sellerName}>Angela Yu</Text>
              <Text style={styles.sellerLocation}>
                <Icon name="map-marker" size={12} /> Grafenwoehr, Germany
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.condition}>Used</Text>
            <Text style={styles.delivery}>Pickup</Text>
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
        {activeTab === "Overview" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Auction Details</Text>
            <View style={styles.detailGrid}>
              {[
                ["Starting Price", "$5.00"],
                ["Jump Bid", "$1.00"],
                ["Duration", "7 days"],
                ["Condition", "Used - Like New"],
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
              MacBook Pro 2023, M2 Pro chip with 12-core CPU and 19-core GPU,
              16GB unified memory, 512GB SSD storage. Perfect for professionals
              and creatives. Minor signs of use, fully functional with original
              accessories included. This device has excellent battery life, a
              beautiful Retina display, and comes with a charger and original
              packaging. Ideal for students, developers, or anyone in need of a
              powerful laptop.
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
                  {["Pickup", "Standard Shipping", "Express Delivery"].map(
                    (opt) => (
                      <Text key={opt} style={styles.deliveryTag}>
                        {opt}
                      </Text>
                    )
                  )}
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
                  ].map(([icon, label]) => (
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
        )}

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
          <Text style={styles.bidButtonText}>Bid $1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

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
  readMore: {
    color: "#22c55e",
    fontWeight: "500",
    marginTop: 8,
  },
});

// import {
//   Linking,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useCallback, useLayoutEffect, useState } from "react";
// import { COLORS } from "@/constants/COLORS";
// import { HStack } from "@/components/ui/hstack";
// import { VStack } from "@/components/ui/vstack";
// import { Divider } from "@/components/ui/divider";
// import {
//   EvilIcons,
//   Feather,
//   FontAwesome,
//   Ionicons,
//   MaterialIcons,
// } from "@expo/vector-icons";
// import SubmitButton from "@/common_components/SubmitButton";
// import { SIZES } from "@/constants/SIZES";
// import ReportModal from "@/screens/Auctions/components/ReportModal";
// import { formatAuctionTime } from "@/core/utils";
// import Thumbnail from "@/common_components/Thumbnail";
// import { useSelector } from "react-redux";
// import { getAuction, watchAuction } from "@/state/reducers/auctionsSlice";
// import { getUserInfo } from "@/state/reducers/userSlice";

// const AuctionScreen = ({ navigation, route }) => {
//   // -------------------- Navigation Parameters --------------------
//   const { id } = route.params;

//   // -------------------- Redux State --------------------
//   const auction = useSelector(getAuction(id));
//   const user = useSelector(getUserInfo);
//   console.log("auction receive: ", auction);

//   // -------------------- Local State --------------------
//   const [selectedTab, setSelectedTab] = useState("Overview");
//   const [like, setLike] = useState(
//     auction.watchers?.includes(user.userId) ? "heart" : "heart-o"
//   );
//   const [showReportModal, setShowReportModal] = useState(false);

//   // -------------------- Debugs --------------------
//   console.log("auction receive: ", auction);

//   // -------------------- Effects --------------------
//   // set up Screen header
//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: "Auction",
//       headerTitleAlign: "center",
//       headerLeft: () => (
//         <TouchableOpacity onPress={navigation.goBack}>
//           <Ionicons
//             name="chevron-back-circle"
//             size={30}
//             color={COLORS.primary}
//           />
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <TouchableOpacity onPress={() => setShowReportModal(true)}>
//           <MaterialIcons
//             name="report-gmailerrorred"
//             size={30}
//             color={COLORS.yellow}
//           />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);

//   // -------------------- Handlers --------------------

//   // handle the like the unlike animation
//   const handleLike = () => {
//     if (like === "heart-o") {
//       setLike("heart");
//       watchAuction({ auction_id: auction.id });
//     } else {
//       setLike("heart-o");
//       watchAuction({ auction_id: auction.id });
//     }
//   };

//   const handleOverviewPress = useCallback(() => setSelectedTab("Overview"), []);
//   const handleBidsPress = useCallback(() => setSelectedTab("Bids"), []);

//   // Navigate to chat screen
//   const _navigateToChat = (userId) => {
//     console.log(userId);
//     navigation.navigate("Chat", auction.seller);
//   };

//   // navigate to phone call dial
//   const makeCall = () => {
//     let phoneNumber = "";

//     if (Platform.OS === "android") {
//       phoneNumber = "tel:${12344576557}";
//     } else {
//       phoneNumber = "telprompt:${12344576557}";
//     }

//     Linking.openURL(phoneNumber);
//   };

//   // -------------------- Render --------------------
//   return (
//     <ScrollView style={styles.container}>
//       {/* Auction Image Section (50% of screen) */}
//       <View style={[styles.imageSection, { height: SIZES.height / 2 }]}>
//         <View style={styles.imageContainer}>
//           {/* <Image
//             source={require("../../assets/auctions/macbook.jpg")}
//             style={styles.productImage}
//             resizeMode="contain"
//           /> */}

//           <Thumbnail
//             url={auction.images[0].image}
//             width={300}
//             height={300}
//             borderRadius={10}
//           />

//           {/* Bid Info Overlay */}
//           <View style={styles.bidInfoContainer}>
//             <View style={styles.bidInfo}>
//               <View style={styles.bidInfoItem}>
//                 <Text style={styles.bidPrice}>N{auction.current_price}</Text>
//                 <Text style={styles.bidLabel}>Current Bid</Text>
//               </View>

//               <Divider orientation="vertical" style={styles.divider} />

//               <View style={styles.bidInfoItem}>
//                 <Text style={styles.timer}>
//                   {formatAuctionTime(auction.end_time)}
//                 </Text>
//                 <Text style={styles.bidLabel}>Ends in</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Auction Details Section (50% of screen) */}
//       <View style={[styles.detailsSection, { height: SIZES.height / 2 }]}>
//         <View style={styles.detailsContent}>
//           {/* Product Title and Like Button */}
//           <View style={styles.titleRow}>
//             <View style={styles.titleContainer}>
//               <Text style={styles.productTitle}>{auction.title}</Text>
//               <View style={styles.categoryTag}>
//                 <Text style={styles.categoryText}>
//                   {auction.category.value}
//                 </Text>
//               </View>
//             </View>

//             <Pressable onPress={handleLike} style={styles.likeButton}>
//               <FontAwesome name={like} size={24} color={COLORS.primary} />
//             </Pressable>
//           </View>

//           {/* Owner Card */}
//           <View style={styles.ownerCard}>
//             <Text style={styles.sectionLabel}>Owner</Text>
//             <View style={styles.ownerInfo}>
//               <Thumbnail
//                 url={auction.seller.thumbnail}
//                 width={50}
//                 height={50}
//                 borderRadius={25}
//                 // marginRight: 12,
//               />

//               <View style={styles.ownerDetails}>
//                 <Text style={styles.ownerName}>{auction.seller.username}</Text>
//                 <View style={styles.locationRow}>
//                   <EvilIcons name="location" size={24} color={COLORS.primary} />
//                   <Text style={styles.locationText}>
//                     {auction.seller.latest_location || "Unknown, Uknown"}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.productMeta}>
//                 <Text style={styles.condition}>{auction.item_condition}</Text>
//                 <Text style={styles.delivery}>{auction.shipping_details}</Text>
//               </View>
//             </View>
//           </View>

//           {/* call or chat with owner */}
//           <View
//             style={{ flexDirection: "row", justifyContent: "space-evenly" }}
//           >
//             <View className="flex items-center">
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: COLORS.lightPrimary,
//                   width: 50,
//                   height: 50,
//                   borderRadius: 50 / 2,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//                 onPress={() => _navigateToChat(auction.seller.userId)}
//               >
//                 <Ionicons
//                   name="chatbox-outline"
//                   size={24}
//                   color={COLORS.primary}
//                 />
//               </TouchableOpacity>
//               <Text className="text-center">Chat</Text>
//             </View>
//             <View className="flex items-center">
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: COLORS.lightRed,
//                   width: 50,
//                   height: 50,
//                   borderRadius: 50 / 2,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//                 onPress={makeCall}
//               >
//                 <Feather name="phone-call" size={24} color={COLORS.red} />
//               </TouchableOpacity>
//               <Text className="text-center">Call</Text>
//             </View>
//           </View>

//           {/* Tab Navigation */}
//           <View className="mx-6 mt-6 mb-4 bg-gray-100 rounded-xl p-1.5">
//             <HStack className="w-full ">
//               <TouchableOpacity
//                 className={`flex-1 justify-center items-center py-4 mx-1 rounded-lg ${
//                   selectedTab === "Overview" ? "shadow-xl" : ""
//                 }`}
//                 style={{
//                   borderBottomWidth: 1,
//                   backgroundColor: COLORS.white,
//                   borderBottomColor:
//                     selectedTab === "Overview"
//                       ? COLORS.primary
//                       : COLORS.silverIcon,
//                 }}
//                 onPress={handleOverviewPress}
//                 activeOpacity={0.7}
//               >
//                 <Text
//                   className="font-semibold text-sm"
//                   style={{
//                     color:
//                       selectedTab === "Overview"
//                         ? COLORS.primary
//                         : COLORS.silverIcon,
//                   }}
//                 >
//                   Overview
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 className={`flex-1 justify-center items-center py-3 mx-1 rounded-lg ${
//                   selectedTab === "Bids" ? "shadow-xl" : ""
//                 }`}
//                 style={{
//                   borderBottomWidth: 1,
//                   backgroundColor: COLORS.white,
//                   borderBottomColor:
//                     selectedTab === "Bids" ? COLORS.primary : COLORS.silverIcon,
//                 }}
//                 onPress={handleBidsPress}
//                 activeOpacity={0.7}
//               >
//                 <Text
//                   className="font-semibold text-sm"
//                   style={{
//                     color:
//                       selectedTab === "Bids"
//                         ? COLORS.primary
//                         : COLORS.silverIcon,
//                   }}
//                 >
//                   Bids
//                 </Text>
//               </TouchableOpacity>
//             </HStack>
//           </View>

//           {/* Tab Content */}
//           <View className="flex-1">
//             {selectedTab === "Overview" && (
//               <VStack>
//                 <Text>Description</Text>
//                 <Text>
//                   Descriptionduibuibcbjcjkzcb
//                   {auction.description}....Read More
//                 </Text>
//               </VStack>
//             )}
//             {selectedTab === "Bids" && (
//               <VStack>
//                 <Text>Bids</Text>
//                 <VStack>
//                   <HStack>
//                     <Thumbnail
//                       url={auction.seller.thumbnail}
//                       width={50}
//                       height={50}
//                       borderRadius={25}
//                       // marginRight: 12,
//                     />
//                     <VStack style={{ flex: 1 }}>
//                       <Text
//                         style={{
//                           color: COLORS.primary,
//                           fontWeight: "bold",
//                           fontSize: 20,
//                         }}
//                       >
//                         Angela Yu
//                       </Text>
//                       <HStack space="sm">
//                         <EvilIcons
//                           name="location"
//                           size={30}
//                           color={COLORS.primary}
//                         />
//                         <Text
//                           style={{
//                             color: COLORS.silverIcon,
//                             fontWeight: "bold",
//                             fontSize: 16,
//                           }}
//                         >
//                           Yola, Adamawa
//                         </Text>
//                       </HStack>
//                     </VStack>

//                     <VStack style={{ alignContent: "flex-end" }}>
//                       <Text
//                         style={{
//                           color: COLORS.primary,
//                           fontWeight: "bold",
//                           fontSize: 16,
//                         }}
//                       >
//                         N100
//                       </Text>
//                     </VStack>
//                   </HStack>
//                 </VStack>
//               </VStack>
//             )}
//           </View>

//           {/* Submit Button */}
//           <View style={styles.buttonContainer}>
//             <SubmitButton text="Submit Jump Bid" />
//           </View>
//         </View>
//       </View>

//       {showReportModal && (
//         <ReportModal
//           show={showReportModal}
//           onClose={() => setShowReportModal(false)}
//         />
//       )}
//     </ScrollView>
//   );
// };

// export default AuctionScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   imageSection: {
//     width: "100%",
//     backgroundColor: COLORS.lightPrimary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   imageContainer: {
//     position: "relative",
//     alignItems: "center",
//   },
//   productImage: {
//     width: 300,
//     height: 300,
//     borderRadius: 10,
//   },
//   bidInfoContainer: {
//     position: "absolute",
//     bottom: -25,
//   },
//   bidInfo: {
//     flexDirection: "row",
//     backgroundColor: COLORS.white,
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   bidInfoItem: {
//     alignItems: "center",
//     paddingHorizontal: 10,
//   },
//   bidPrice: {
//     color: COLORS.primary,
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   timer: {
//     color: COLORS.primary,
//     fontSize: 16,
//   },
//   bidLabel: {
//     color: COLORS.silverIcon,
//     fontWeight: "bold",
//     fontSize: 12,
//   },
//   divider: {
//     height: "60%",
//     marginHorizontal: 10,
//   },
//   detailsSection: {
//     width: "100%",
//     padding: 18,
//   },
//   detailsContent: {
//     flex: 1,
//   },
//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   productTitle: {
//     color: COLORS.silverIcon,
//     fontWeight: "bold",
//     fontSize: 20,
//     marginRight: 10,
//   },
//   categoryTag: {
//     backgroundColor: COLORS.lightPrimary,
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//   },
//   categoryText: {
//     color: COLORS.primary,
//     fontWeight: "bold",
//     fontSize: 12,
//   },
//   likeButton: {
//     padding: 8,
//   },
//   ownerCard: {
//     marginBottom: 20,
//   },
//   sectionLabel: {
//     color: COLORS.silverIcon,
//     marginBottom: 8,
//     fontSize: 14,
//   },
//   ownerInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   ownerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   ownerDetails: {
//     flex: 1,
//   },
//   ownerName: {
//     color: COLORS.primary,
//     fontWeight: "bold",
//     fontSize: 18,
//     marginBottom: 4,
//   },
//   locationRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   locationText: {
//     color: COLORS.silverIcon,
//     fontWeight: "bold",
//     fontSize: 14,
//   },
//   productMeta: {
//     alignItems: "flex-end",
//   },
//   condition: {
//     color: COLORS.yellow,
//     fontWeight: "bold",
//     fontSize: 14,
//   },
//   delivery: {
//     color: COLORS.primary,
//     fontWeight: "bold",
//     fontSize: 14,
//     marginTop: 4,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#f5f5f5",
//     borderRadius: 10,
//     padding: 4,
//     marginBottom: 20,
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "transparent",
//   },
//   activeTab: {
//     borderBottomColor: COLORS.primary,
//     backgroundColor: "#fff",
//   },
//   tabText: {
//     fontWeight: "600",
//     color: COLORS.silverIcon,
//   },
//   activeTabText: {
//     color: COLORS.primary,
//   },
//   tabContent: {
//     flex: 1,
//   },
//   overviewContent: {
//     marginBottom: 20,
//   },
//   descriptionText: {
//     color: "#666",
//     lineHeight: 20,
//   },
//   bidsContent: {
//     marginBottom: 20,
//   },
//   bidderCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     backgroundColor: "#f9f9f9",
//     borderRadius: 8,
//   },
//   bidderImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   bidderDetails: {
//     flex: 1,
//   },
//   bidderName: {
//     color: COLORS.primary,
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   bidAmount: {
//     color: COLORS.primary,
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   buttonContainer: {
//     marginTop: "auto",
//     paddingBottom: 20,
//   },
// });
