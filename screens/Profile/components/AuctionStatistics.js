import { View, Text } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const AuctionStatistics = () => {
  const stats = [
    {
      label: "Ongoing",
      count: 12,
      icon: "hourglass-half",
    },
    {
      label: "Completed",
      count: 24,
      icon: "check-circle",
    },
    {
      label: "Closed",
      count: 6,
      icon: "times-circle",
    },
    {
      label: "Won",
      count: 18,
      icon: "trophy",
    },
  ];

  return (
    <View className="mt-8">
      <Text className="text-lg font-semibold mb-4">Auction Statistics</Text>

      <View className="bg-white rounded-lg shadow-sm p-4">
        <View className="flex flex-row flex-wrap -mx-2">
          {stats.map((item, index) => (
            <View key={index} className="w-1/2 px-2 mb-4">
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                  <FontAwesome5 name={item.icon} size={18} color="#22c55e" />
                </View>
                <View>
                  <Text className="text-xs text-gray-500">{item.label}</Text>
                  <Text className="font-semibold">{item.count}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default AuctionStatistics;
