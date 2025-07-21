import React from "react";
import { FlatList } from "react-native";
import SkeletonBubble from "./MessageBubbleSkeleton";

const SKELETON_COUNT = 10;

const ChatSkeleton = () => {
  const skeletons = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    key: i.toString(),
    isMe: i % 2 === 1,
  }));

  return (
    <FlatList
      data={skeletons}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => <SkeletonBubble isMe={item.isMe} />}
      className="flex-1"
      contentContainerStyle={{
        paddingTop: 30,
        flexGrow: 1,
        // justifyContent: "flex-end",
      }}
      inverted={true}
    />
  );
};

export default ChatSkeleton;
