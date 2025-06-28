import { UserType } from "../user/user.type";
import { BidType } from "./bid.type";
import { CategoryType } from "./category.type";
import { ImageType } from "./image.type";

export interface AuctionType {
  id: string;
  title: string;
  description: string;
  starting_price: string;
  current_price: string;
  bid_increment: string;
  status: "ongoing" | "upcoming" | "ended"; // adjust as needed
  seller: UserType;
  winner: UserType | null;
  category: CategoryType;
  watchers: UserType[];
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  shipping_details: string;
  payment_methods: string[];
  item_condition: "new" | "used" | string;
  images: ImageType[];
  bids: BidType[];
  highest_bid: BidType | null;
  user_bid: BidType | null;
  duration: string;
  is_active: boolean;
  has_ended: boolean;
}
