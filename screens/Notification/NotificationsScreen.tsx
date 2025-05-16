import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

type NotificationType =
  | "ending"
  | "ended"
  | "won"
  | "lost"
  | "outbid"
  | "price_drop";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  // itemImage: string;
  itemImage: ImageSourcePropType;
  itemName: string;
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "ending":
      return <FontAwesome5 name="clock" size={16} color="#f97316" />; // orange-500
    case "ended":
      return <FontAwesome5 name="hourglass-end" size={16} color="#3b82f6" />; // blue-500
    case "won":
      return <FontAwesome5 name="trophy" size={16} color="#facc15" />; // yellow-500
    case "lost":
      return <FontAwesome5 name="times-circle" size={16} color="#ef4444" />; // red-500
    case "outbid":
      return <FontAwesome5 name="arrow-up" size={16} color="#8b5cf6" />; // purple-500
    case "price_drop":
      return <FontAwesome5 name="tag" size={16} color="#22c55e" />; // green-500
    default:
      return <FontAwesome5 name="bell" size={16} color="#6b7280" />; // gray-500
  }
};

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "ending",
    title: "Auction Ending Soon",
    message:
      'Your bid on "Vintage Camera" is currently winning! Auction ends in 5 minutes.',
    time: "5 min ago",
    read: false,
    itemImage: require("../../assets/auctions/camera1.jpg"),
    itemName: "Vintage Camera",
  },
  {
    id: "2",
    type: "won",
    title: "Auction Won!",
    message:
      'Congratulations! You won the auction for "Mechanical Keyboard" with a bid of $89.50.',
    time: "2 hours ago",
    read: true,
    itemImage: require("../../assets/auctions/camera1.jpg"),
    itemName: "Mechanical Keyboard",
  },
  {
    id: "3",
    type: "outbid",
    title: "You've Been Outbid",
    message:
      'Someone has outbid you on "Wireless Earbuds". Current highest bid is now $65.00.',
    time: "4 hours ago",
    read: false,
    itemImage: require("../../assets/auctions/camera1.jpg"),
    itemName: "Wireless Earbuds",
  },
  {
    id: "4",
    type: "ended",
    title: "Auction Ended",
    message:
      'The auction for "Vintage Watch" has ended. You were outbid in the final moments.',
    time: "1 day ago",
    read: true,
    itemImage: require("../../assets/auctions/camera1.jpg"),
    itemName: "Vintage Watch",
  },
  {
    id: "5",
    type: "price_drop",
    title: "Price Drop Alert",
    message:
      'The starting bid for "Polaroid Camera" that you\'re watching has been reduced to $45.00.',
    time: "2 days ago",
    read: true,
    itemImage: require("../../assets/auctions/camera1.jpg"),
    itemName: "Polaroid Camera",
  },
];
// const sampleNotifications: Notification[] = [];

const NotificationsScreen = () => {
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "unread"
  >("all");

  const unreadCount = sampleNotifications.filter((n) => !n.read).length;
  const filteredNotifications =
    notificationFilter === "all"
      ? sampleNotifications
      : sampleNotifications.filter((n) => !n.read);

  return (
    <ScrollView className="pt-16 pb-16 px-4 bg-gray-50">
      {/* Filter Tabs */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => setNotificationFilter("all")}
            className={`px-3 py-1 rounded-full ${
              notificationFilter === "all" ? "bg-green-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                notificationFilter === "all" ? "text-white" : "text-gray-600"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNotificationFilter("unread")}
            className={`px-3 py-1 rounded-full ${
              notificationFilter === "unread" ? "bg-green-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                notificationFilter === "unread" ? "text-white" : "text-gray-600"
              }`}
            >
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text className="text-green-500 text-sm font-medium">
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        filteredNotifications.map((notification) => (
          <View
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-4 mb-3 ${
              !notification.read ? "border-l-4 border-green-500" : ""
            }`}
          >
            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                {getNotificationIcon(notification.type)}
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-medium text-sm">
                    {notification.title}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {notification.time}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </Text>

                <View className="mt-3 flex-row items-center bg-gray-50 rounded-lg p-2">
                  {/* <Image
                    source={{ uri: notification.itemImage }}
                    className="w-12 h-12 rounded-md mr-3"
                    resizeMode="cover"
                  /> */}
                  <Image
                    source={notification.itemImage}
                    className="w-5 h-5 rounded-md mr-3"
                    resizeMode="cover"
                    style={{ width: 48, height: 48 }}
                  />
                  <View>
                    <Text className="text-sm font-medium">
                      {notification.itemName}
                    </Text>
                    {notification.type === "ending" && (
                      <TouchableOpacity className="mt-1 px-3 py-1 bg-green-500 rounded-full">
                        <Text className="text-white text-xs">View Auction</Text>
                      </TouchableOpacity>
                    )}
                    {notification.type === "won" && (
                      <TouchableOpacity className="mt-1 px-3 py-1 bg-green-500 rounded-full">
                        <Text className="text-white text-xs">
                          Complete Purchase
                        </Text>
                      </TouchableOpacity>
                    )}
                    {notification.type === "outbid" && (
                      <TouchableOpacity className="mt-1 px-3 py-1 bg-green-500 rounded-full">
                        <Text className="text-white text-xs">
                          Place New Bid
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View className="items-center justify-center py-10">
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
            <FontAwesome name="bell-slash" size={24} color="#9ca3af" />
          </View>
          <Text className="text-gray-500 text-center">
            No notifications to display
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default NotificationsScreen;
