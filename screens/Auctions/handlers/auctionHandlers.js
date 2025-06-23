// ------------ Auction Handlers --------------

import { Linking, Platform } from "react-native";
import { watchAuction } from "@/state/reducers/auctionsSlice";

// navigate to phone call dial
export const makeCall = (phone_number) => {
  let phoneNumber = "";

  if (Platform.OS === "android") {
    phoneNumber = `tel:${phone_number}`;
  } else {
    phoneNumber = `telprompt:${phone_number}`;
  }

  Linking.openURL(phoneNumber);
};

// Navigate to chat screen
export const _navigateToChat = (navigation, auction) => {
  // console.log(userId);
  navigation.navigate("Chat", auction?.seller);
};

// Rating submition
export const handleRatingSubmit = ({ rating }) => {
  console.log("User Rating:", rating);
  // Send to backend
};

// handle the like the unlike animation
export const handleLike = (like, setLike, auction) => {
  if (like === "heart-o") {
    setLike("heart");
    watchAuction({ auction_id: auction?.id });
  } else {
    setLike("heart-o");
    watchAuction({ auction_id: auction?.id });
  }
};

// Submit Report
export const submitReport = (data) => {
  console.log("Report Submitted:", data);
  // Send to backend here
};
