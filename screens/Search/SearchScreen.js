import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/constants/COLORS";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Empty from "@/common_components/Empty";
import { likes } from "@/mockData/likes";
import SearchRow from "@/screens/Search/components/SearchRow";
import { useDispatch, useSelector } from "react-redux";
import { getSearchList, searchAuctions } from "@/state/reducers/auctionsSlice";
import { getUserInfo } from "@/state/reducers/userSlice";
import { EmptyState } from "@/common_components/EmptyState";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch(); // Get dispatch function
  // const list = useSelector(getSearchList);

  // console.log(list);

  // const searchList = likes;
  const searchList = useSelector(getSearchList);
  console.log("search List: ", searchList);

  useEffect(() => {
    // debouncing for best practise to reduce api call everytime
    const delay = setTimeout(() => {
      dispatch(searchAuctions(query));
    }, 500); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.searchContainer} onPress={{}}>
        <View>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#b0b0b0"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
          <FontAwesome
            name="search"
            size={20}
            color={COLORS.primary}
            style={styles.searchIcon}
          />
        </View>
      </View>

      {searchList === null ? (
        <EmptyState type="search" message={"Search Items"} centered={false} />
      ) : searchList.length === 0 ? (
        <EmptyState
          type="emptySearchResult"
          message={'No items found "' + query + '"'}
          centered={false}
        />
      ) : (
        <FlatList
          data={searchList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SearchRow auction={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    marginBottom: 10,
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
    position: "absolute",
    left: 18,
    top: 17,
  },
  searchInput: {
    backgroundColor: "#e1e2e4",
    height: 52,
    borderRadius: 26,
    fontSize: 16,
    color: "black",
    paddingLeft: 50,
  },
});
