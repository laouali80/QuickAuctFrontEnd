import {
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import Empty from "./Empty";
import { COLORS } from "@/constants/COLORS";

const ICONS = {
  auctions: (
    <FontAwesome
      name="heart"
      size={90}
      color={COLORS.primary}
      style={{
        margimBottom: 16,
      }}
    />
  ),
  bids: (
    <MaterialCommunityIcons
      name="gavel"
      size={90}
      color={COLORS.primary}
      style={{
        margimBottom: 16,
      }}
    />
  ),
  sales: (
    <FontAwesome5
      name="store"
      size={90}
      color={COLORS.primary}
      style={{
        margimBottom: 16,
      }}
    />
  ),
  likes: (
    <FontAwesome
      name="heart"
      size={90}
      color={COLORS.primary}
      style={{
        margimBottom: 16,
      }}
    />
  ),
  chats: (
    <FontAwesome5
      name="inbox"
      size={90}
      color={COLORS.primary}
      style={{
        margimBottom: 16,
      }}
    />
  ),
  search: (
    <FontAwesome6
      name="magnifying-glass"
      size={90}
      color={COLORS.primary}
      style={{
        margimBottom: 16,
      }}
    />
  ),
  emptySearchResult: (
    <FontAwesome6
      name="triangle-exclamation"
      size={90}
      color={COLORS.primary}
      style={{
        margimBottom: 16,
      }}
    />
  ),
};

export const EmptyState = ({ type, message, centered = true }) => (
  <Empty icon={ICONS[type]} message={message} centered={centered} />
);
