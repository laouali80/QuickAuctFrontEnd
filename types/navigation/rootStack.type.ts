import { BidType } from "../auction/bid.type";

export type RootStackParamList = {
  BidHistory: { bids: BidType[] }; // or { someParam: string } if it accepts params
  // ... other screens
};

// export type RootStackParamList = {
//   BidHistory: { auctionId: string }; // ← expects a string param
//   // Other screens...
// };

// const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

// navigation.navigate("BidHistory", { auctionId: "1234-auction-uuid" });

// import { RouteProp, useRoute } from "@react-navigation/native";
// import type { RootStackParamList } from "../navigation/types";

// type BidHistoryRouteProp = RouteProp<RootStackParamList, "BidHistory">;

// const BidHistory = () => {
//   const route = useRoute<BidHistoryRouteProp>();
//   const { auctionId } = route.params;

//   return <Text>Showing bids for auction {auctionId}</Text>;
// };
