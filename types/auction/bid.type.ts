// Bid type definition

import { UserType } from "../user/user.type";

// export interface BidType {
//   id: number;
//   bidder: {
//     name: string;
//     avatar: string;
//   };
//   amount: number;
//   timestamp: string;
//   isCurrentUser: boolean;
//   status?: string;
// }

export interface BidType {
  id: number;
  auction: string;
  bidder: UserType;
  amount: string;
  placed_at: string;
  is_winner: boolean;
  is_highest_bid: boolean;
  isCurrentUser?: boolean;
  status?: string;
}
