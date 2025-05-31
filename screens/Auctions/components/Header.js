import {
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import SearchFilter from "../../Search/components/SearchFilter";
import { useSelector } from "react-redux";
import { getUserInfo } from "@/state/reducers/userSlice";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();
  const user = useSelector(getUserInfo);
  // console.log("from header: ", user);
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [user?.latest_location]);

  const _navigate = () => {
    // console.log("reach");
    navigation.navigate("Notifications");
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Location and Notification */}
      <View style={styles.topBar}>
        <View style={styles.location}>
          <EvilIcons name="location" size={24} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {user?.latest_location || "Locating..."}
            {/* {"Locating..."} */}
          </Text>
        </View>
        <TouchableOpacity onPress={_navigate}>
          <FontAwesome
            name="bell-o"
            size={24}
            color={COLORS.primary}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchFilter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 16,

    backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparent white

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
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
