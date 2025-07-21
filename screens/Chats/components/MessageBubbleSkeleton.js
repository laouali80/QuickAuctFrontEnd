import React from "react";
import { View } from "react-native";

const SkeletonBubble = ({ isMe }) => (
  <View
    className={`flex-row my-1.5 px-2 ${isMe ? "justify-end" : "justify-start"}`}
  >
    <View
      className={`
        rounded-2xl min-h-[42px] min-w-[120px] max-w-[75%] px-4 py-3
        opacity-70 animate-pulse
        ${isMe ? "bg-green-200" : "bg-gray-200"}
      `}
    />
  </View>
);

export default SkeletonBubble;