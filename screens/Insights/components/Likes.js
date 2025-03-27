import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { likes } from "@/mockData/likes";
import LikeCard from "@/auction-components/LikeCard";

const Likes = () => {
  return (
    <View className="mx-6 mt-6 ">
      <FlatList
        data={likes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <LikeCard auction={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Likes;

const styles = StyleSheet.create({});
