import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { COLORS } from "@/constants/COLORS";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import SubmitButton from "@/auction-components/share-components/SubmitButton";
import { SIZES } from "@/constants/SIZES";
import ReportModal from "@/auction-components/share-components/ReportModal";

const AuctionScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Auction",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowReportModal(true)}>
          <MaterialIcons
            name="report-gmailerrorred"
            size={30}
            color={COLORS.yellow}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [showReportModal, setShowReportModal] = useState(false);

  const [selectedTab, setSelectedTab] = useState("Overview");

  const [like, setLike] = useState("heart-o");

  const handleLike = () => {
    like === "heart-o" ? setLike("heart") : setLike("heart-o");
  };

  const handleOverviewPress = useCallback(() => setSelectedTab("Overview"), []);
  const handleBidsPress = useCallback(() => setSelectedTab("Bids"), []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Auction Image Section (50% of screen) */}
        <View style={[styles.imageSection, { height: SIZES.height / 2 }]}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/auctions/macbook.jpg")}
              style={styles.productImage}
              resizeMode="contain"
            />

            {/* Bid Info Overlay */}
            <View style={styles.bidInfoContainer}>
              <View style={styles.bidInfo}>
                <View style={styles.bidInfoItem}>
                  <Text style={styles.bidPrice}>N100</Text>
                  <Text style={styles.bidLabel}>Current Bid</Text>
                </View>

                <Divider orientation="vertical" style={styles.divider} />

                <View style={styles.bidInfoItem}>
                  <Text style={styles.timer}>28:43:12</Text>
                  <Text style={styles.bidLabel}>Ends in</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Auction Details Section (50% of screen) */}
        <View style={[styles.detailsSection, { height: SIZES.height / 2 }]}>
          <View style={styles.detailsContent}>
            {/* Product Title and Like Button */}
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.productTitle}>Macbook Pro</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>ELECTRONICS</Text>
                </View>
              </View>

              <Pressable onPress={handleLike} style={styles.likeButton}>
                <FontAwesome name={like} size={24} color={COLORS.primary} />
              </Pressable>
            </View>

            {/* Owner Card */}
            <View style={styles.ownerCard}>
              <Text style={styles.sectionLabel}>Owner</Text>
              <View style={styles.ownerInfo}>
                <Image
                  source={require("../assets/profiles/default.png")}
                  style={styles.ownerImage}
                />

                <View style={styles.ownerDetails}>
                  <Text style={styles.ownerName}>Angela Yu</Text>
                  <View style={styles.locationRow}>
                    <EvilIcons
                      name="location"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.locationText}>Yola, Adamawa</Text>
                  </View>
                </View>

                <View style={styles.productMeta}>
                  <Text style={styles.condition}>Used</Text>
                  <Text style={styles.delivery}>Pickup</Text>
                </View>
              </View>
            </View>

            {/* Tab Navigation */}
            <View className="mx-6 mt-6 mb-4 bg-gray-100 rounded-xl p-1.5">
              <HStack className="w-full ">
                <TouchableOpacity
                  className={`flex-1 justify-center items-center py-4 mx-1 rounded-lg ${
                    selectedTab === "Overview" ? "shadow-xl" : ""
                  }`}
                  style={{
                    borderBottomWidth: 1,
                    backgroundColor: COLORS.white,
                    borderBottomColor:
                      selectedTab === "Overview"
                        ? COLORS.primary
                        : COLORS.silverIcon,
                  }}
                  onPress={handleOverviewPress}
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-semibold text-sm"
                    style={{
                      color:
                        selectedTab === "Overview"
                          ? COLORS.primary
                          : COLORS.silverIcon,
                    }}
                  >
                    Overview
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 justify-center items-center py-3 mx-1 rounded-lg ${
                    selectedTab === "Bids" ? "shadow-xl" : ""
                  }`}
                  style={{
                    borderBottomWidth: 1,
                    backgroundColor: COLORS.white,
                    borderBottomColor:
                      selectedTab === "Bids"
                        ? COLORS.primary
                        : COLORS.silverIcon,
                  }}
                  onPress={handleBidsPress}
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-semibold text-sm"
                    style={{
                      color:
                        selectedTab === "Bids"
                          ? COLORS.primary
                          : COLORS.silverIcon,
                    }}
                  >
                    Bids
                  </Text>
                </TouchableOpacity>
              </HStack>
            </View>

            {/* Tab Content */}
            <View className="flex-1">
              {selectedTab === "Overview" && (
                <VStack>
                  <Text>Description</Text>
                  <Text>
                    Descriptionduibuibcbjcjkzcb
                    sfjssdbskdjbsjdbjsbdjkbcsdjkbcjsdbkd fklfnlksdnfkf
                    kfkfskfsknkn sd....Read More
                  </Text>
                </VStack>
              )}
              {selectedTab === "Bids" && (
                <VStack>
                  <Text>Bids</Text>
                  <VStack>
                    <HStack>
                      <Image
                        source={require("../assets/profiles/default.png")}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          // backgroundColor: "#e0e0e0",
                        }}
                      />
                      <VStack style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: COLORS.primary,
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          Angela Yu
                        </Text>
                        <HStack space="sm">
                          <EvilIcons
                            name="location"
                            size={30}
                            color={COLORS.primary}
                          />
                          <Text
                            style={{
                              color: COLORS.silverIcon,
                              fontWeight: "bold",
                              fontSize: 16,
                            }}
                          >
                            Yola, Adamawa
                          </Text>
                        </HStack>
                      </VStack>

                      <VStack style={{ alignContent: "flex-end" }}>
                        <Text
                          style={{
                            color: COLORS.primary,
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          N100
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>
              )}
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <SubmitButton text="Submit Jump Bid" />
            </View>
          </View>
        </View>
      </View>
      {showReportModal && (
        <ReportModal
          show={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </ScrollView>
  );
};

export default AuctionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageSection: {
    width: "100%",
    backgroundColor: COLORS.lightPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  productImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  bidInfoContainer: {
    position: "absolute",
    bottom: -25,
  },
  bidInfo: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bidInfoItem: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  bidPrice: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
  timer: {
    color: COLORS.primary,
    fontSize: 16,
  },
  bidLabel: {
    color: COLORS.silverIcon,
    fontWeight: "bold",
    fontSize: 12,
  },
  divider: {
    height: "60%",
    marginHorizontal: 10,
  },
  detailsSection: {
    width: "100%",
    padding: 18,
  },
  detailsContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  productTitle: {
    color: COLORS.silverIcon,
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 10,
  },
  categoryTag: {
    backgroundColor: COLORS.lightPrimary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  likeButton: {
    padding: 8,
  },
  ownerCard: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: COLORS.silverIcon,
    marginBottom: 8,
    fontSize: 14,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: COLORS.silverIcon,
    fontWeight: "bold",
    fontSize: 14,
  },
  productMeta: {
    alignItems: "flex-end",
  },
  condition: {
    color: COLORS.yellow,
    fontWeight: "bold",
    fontSize: 14,
  },
  delivery: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
    backgroundColor: "#fff",
  },
  tabText: {
    fontWeight: "600",
    color: COLORS.silverIcon,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  tabContent: {
    flex: 1,
  },
  overviewContent: {
    marginBottom: 20,
  },
  descriptionText: {
    color: "#666",
    lineHeight: 20,
  },
  bidsContent: {
    marginBottom: 20,
  },
  bidderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  bidderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  bidderDetails: {
    flex: 1,
  },
  bidderName: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  bidAmount: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingBottom: 20,
  },
});
