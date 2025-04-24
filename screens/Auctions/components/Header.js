import {
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import SearchFilter from "../../Search/components/SearchFilter";
import CategoriesFilter from "./CategoriesFilter";
import { useSelector } from "react-redux";
import { getUserInfo } from "@/state/reducers/userSlice";

const Header = () => {
  const user = useSelector(getUserInfo);
  console.log("from header: ", user);
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [user.latest_location]);
  return (
    <SafeAreaView style={styles.container}>
      {/* Location and Notification */}
      <View style={styles.topBar}>
        <View style={styles.location}>
          <EvilIcons name="location" size={24} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {user.latest_location || "Locating..."}
            {/* {"Locating..."} */}
          </Text>
        </View>

        <FontAwesome
          name="bell-o"
          size={24}
          color={COLORS.primary}
          style={styles.notificationIcon}
        />
      </View>

      {/* Search Bar */}
      <SearchFilter />

      {/* Categories */}
      <CategoriesFilter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    // borderColor: "red",
    // borderWidth: 2,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    maxWidth: 180, // optional
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.darkText,
  },
  notificationIcon: {
    marginLeft: 8,
  },
});
export default Header;
