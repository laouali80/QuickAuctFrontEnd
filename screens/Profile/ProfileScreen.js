import Thumbnail from "@/common_components/Thumbnail";
import { getTokens, getUserInfo } from "@/state/reducers/userSlice";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TextArea,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import EditModal from "./components/EditModal";
import { fetchUserAuctions } from "@/state/reducers/auctionsSlice";
import ProfileLogout from "./components/ProfileLogout";
import ProfileInfoModal from "./components/ProfileInfoModal";

export default function ProfileScreen({ route }) {
  const update = route?.params;
  const user = useSelector(getUserInfo);
  const dispatch = useDispatch();
  const tokens = useSelector(getTokens);
  dispatch(fetchUserAuctions({ token: tokens }));
  // console.log(user);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ispersonInfoModalOpen, setIsPersonInfoModalOpen] = useState(
    update ? true : false
  );
  const [editedInfo, setEditedInfo] = useState({
    email: "",
    phone: "",
    address: "",
    paymentCard: "",
  });
  const [personalInfo] = useState({
    email: "michael@example.com",
    phone: "+44 123 456 7890",
    address: "123 Main Street, London, UK",
    paymentCard: "**** **** **** 1234",
  });

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pb-16">
      {/* Profile Header */}
      <View className="mt-6 items-center">
        <View className="relative">
          <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500">
            {/* <Image
              source={{ uri: "https://readdy.ai/api/search-image?..." }}
              className="w-full h-full"
              resizeMode="cover"
            /> */}
            <Thumbnail
              url={user?.thumbnail}
              width={100}
              height={100}
              // borderRadius={90}
            />
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full items-center justify-center">
            <Icon name="camera" size={14} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="mt-3 text-xl font-semibold">{user.username}</Text>
        <View className="flex-row items-center mt-1 text-gray-600">
          <Icon name="map-marker-alt" size={14} color="#4B5563" />
          <Text className="text-sm ml-1 text-gray-600">
            {user.latest_location || "Locating..."}
          </Text>
        </View>
        <View className="flex-row items-center mt-4 space-x-4">
          {/* <Stat label="Rating" value="4.9" /> */}
          <Divider />
          <Stat label="Auctions" value="42" />
          <Divider />
          {/* <Stat label="Success" value="97%" /> */}
        </View>
        <TouchableOpacity
          className="mt-4 px-4 py-2 border border-green-500 rounded-full"
          onPress={() => setIsPersonInfoModalOpen(true)}
        >
          <Text className="text-green-500 text-sm font-medium">
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* My Auctions Tabs */}
      <View className="mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold">My Auctions</Text>
          <Text className="text-green-500 text-sm">See All</Text>
        </View>
        <View className="flex-row border-b border-gray-200 mb-4">
          {["ongoing", "closed", "completed"].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-4 py-2 ${
                activeTab === tab ? "border-b-2 border-green-500" : ""
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab ? "text-green-500" : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sample Auction Cards */}
        <AuctionCard
          title="Gaming Headphones"
          category="Tech"
          timeLeft="Ends in 1d 4h"
          bid="$24.50"
          bids="7"
          // imageUrl="https://readdy.ai/api/search-image?...&seq=2"
          imageUrl={require("../../assets/auctions/Gheadphone.jpg")}
        />
        <AuctionCard
          title="Vintage Camera"
          category="Collectibles"
          timeLeft="Ends in 6h 20m"
          bid="$75.00"
          bids="12"
          imageUrl={require("../../assets/auctions/camera1.jpg")}
        />
      </View>

      {/* Store Statistics */}
      <View className="mt-8">
        <Text className="text-lg font-semibold mb-4">Store Statistics</Text>
        <View className="bg-white rounded-lg shadow-sm p-4">
          <Stats icon="box" label="Items Sold" value="38" />
          <Stats icon="chart-line" label="Success Rate" value="97%" />
          <Stats icon="star" label="Avg. Rating" value="4.9/5" />
          <Stats icon="wallet" label="Revenue" value="$2,450" />
        </View>
      </View>

      {/* Personal Info */}
      <View className="mt-8 mb-20">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold">Personal Information</Text>
          <TouchableOpacity onPress={() => setIsEditModalOpen(true)}>
            <Text className="text-green-500 text-sm">Edit</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <InfoRow label="Email" value={personalInfo.email} />
          <InfoRow label="Phone" value={personalInfo.phone} />
          <InfoRow label="Shipping Address" value={personalInfo.address} />
          <View>
            <Text className="text-xs text-gray-500 mb-1">Payment Methods</Text>
            <View className="flex-row items-center">
              <Icon name="cc-visa" size={18} color="#2563EB" />
              <Text className="ml-2 text-sm">{personalInfo.paymentCard}</Text>
            </View>
          </View>
        </View>
      </View>

      <ProfileLogout />

      {/* Modal */}
      <EditModal
        visible={isEditModalOpen}
        editedInfo={personalInfo}
        setEditedInfo={setEditedInfo}
        onCancel={() => setIsEditModalOpen(false)}
        // onSave={handleSave}
      />

      <ProfileInfoModal
        visible={ispersonInfoModalOpen}
        onCancel={() => setIsPersonInfoModalOpen(false)}
        // onSave={handleSave}
      />
    </ScrollView>
  );
}

const Stat = ({ label, value }) => (
  <View className="items-center">
    <Text className="font-semibold text-green-500">{value}</Text>
    <Text className="text-xs text-gray-600">{label}</Text>
  </View>
);

const Divider = () => <View className="h-6 border-r border-gray-300 mx-2" />;

const AuctionCard = ({ title, category, timeLeft, bid, bids, imageUrl }) => (
  <View className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden">
    <View className="relative">
      <Image
        // source={{ uri: imageUrl }}
        source={imageUrl}
        className="w-full h-32"
        resizeMode="cover"
        style={{ width: "auto", height: 112 }}
      />
      <TouchableOpacity className="absolute top-2 right-2">
        <Icon name="heart" size={16} color="#22C55E" solid={false} />
      </TouchableOpacity>
    </View>
    <View className="p-3">
      <Text className="font-medium text-sm">{title}</Text>
      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
          {category}
        </Text>
        <Text className="text-xs text-gray-500">{timeLeft}</Text>
      </View>
      <Text className="mt-2 text-xs text-gray-500">Current Bid</Text>
      <Text className="text-green-500 font-semibold">{bid}</Text>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-xs text-gray-500">Bids: {bids}</Text>
        <Icon name="arrow-right" size={14} color="#22C55E" />
      </View>
    </View>
  </View>
);

const Stats = ({ icon, label, value }) => (
  <View className="flex-row items-center mb-4">
    <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
      <Icon name={icon} size={16} color="#22C55E" />
    </View>
    <View>
      <Text className="text-xs text-gray-500">{label}</Text>
      <Text className="font-semibold">{value}</Text>
    </View>
  </View>
);

const InfoRow = ({ label, value }) => (
  <View>
    <Text className="text-xs text-gray-500 mb-1">{label}</Text>
    <Text className="text-sm">{value}</Text>
  </View>
);

// export default ProfileScreen;

// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import ProfileImage from "./components/ProfileImage";
// import ProfileLogout from "./components/ProfileLogout";
// import { useSelector } from "react-redux";
// import { getUserInfo } from "@/state/reducers/userSlice";

// const ProfileScreen = () => {
//   const user = useSelector(getUserInfo);
//   console.log(user);
//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         paddingTop: 100,
//       }}
//     >
//       <ProfileImage />

//       <Text
//         style={{
//           textAlign: "center",
//           color: "#303030",
//           fontSize: 20,
//           fontWeight: "bold",
//           marginTop: 6,
//         }}
//       >
//         {user.first_name} {user.last_name}
//       </Text>
//       <Text
//         style={{
//           textAlign: "center",
//           color: "#606060",
//           fontSize: 14,
//         }}
//       >
//         {user.username}
//       </Text>

//       <ProfileLogout />
//     </View>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({});
