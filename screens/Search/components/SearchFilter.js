import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";
import { useNavigation } from "@react-navigation/native";

const SearchFilter = () => {
  const navigation = useNavigation();

  const onSearch = () => {
    navigation.navigate("Search");
  };
  return (
    <TouchableOpacity style={styles.searchContainer} onPress={onSearch}>
      <FontAwesome
        name="search"
        size={20}
        color={COLORS.primary}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search for anything..."
        placeholderTextColor="#808080"
        style={styles.searchInput}
      />
    </TouchableOpacity>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderColor: COLORS.silverIcon,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkText,
    paddingVertical: 0, // Remove default padding on Android
  },
});
