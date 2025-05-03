import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { likes } from "@/mockData/likes";
import LikeCard from "@/screens/Insights/components/LikeCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLikesAuctions,
  getAuctNextPage,
  getLikesAuctions,
} from "@/state/reducers/auctionsSlice";
import Empty from "@/common_components/Empty";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "@/constants/COLORS";

const Likes = () => {
  const dispatch = useDispatch();
  const NextPage = useSelector(getAuctNextPage);
  const likesAuctions = useSelector(getLikesAuctions);
  const [isLoading, setIsLoading] = useState(false);
  const isCooldownRef = useRef(false);
  const [like, setLike] = useState("heart-o");

  // console.log("likesAuctions: ", likesAuctions);

  const handleLike = () => {
    if (like === "heart-o") {
      setLike("heart");
    } else {
      setLike("heart-o");
    }
  };
  // Improved pagination handler
  const handleLoadMore = useCallback(() => {
    console.log("reach");
    // setIsLoading(true);

    if (isLoading || isCooldownRef.current || !NextPage) return;

    console.log("Loading more auctions...");
    setIsLoading(true);
    isCooldownRef.current = true;

    dispatch(fetchLikesAuctions({ page: NextPage }));

    // Delay cooldown reset until after 30 seconds
    setTimeout(() => {
      isCooldownRef.current = false;
    }, 30 * 1000);

    setIsLoading(false);
  }, [isLoading, NextPage]);

  // Show loading indicator
  if (likesAuctions === null) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Show empty if no chats
  if (likesAuctions.length === 0) {
    return (
      <Empty
        icon={
          <Pressable
            style={
              {
                // width: 130,
                // height: 130,
                // borderRadius: 130 / 2,
                // alignItems: "center",
                // justifyContent: "center",
                // backgroundColor: COLORS.lightPrimary,
                // borderWidth: 3,
                // borderColor: "white",
              }
            }
            onPress={handleLike}
          >
            <FontAwesome
              name={like}
              size={90}
              color={COLORS.primary}
              style={{
                margimBottom: 16,
              }}
            />
          </Pressable>
        }
        message="No Watch Auctions"
      />
    );
  }
  return (
    <View className="flex-1 mx-6 mt-6 ">
      <FlatList
        data={likesAuctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <LikeCard auction={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default Likes;

const styles = StyleSheet.create({});
