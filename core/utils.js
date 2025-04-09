import { Platform } from "react-native";
import { BaseAddress } from "./api";
import errorPic from "../assets/errors/error.jpg";

function log() {
  // Much beter console.log function that formats/indents
  // objects for better readability
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    // Stringify and ident object
    if (typeof arg === "object") {
      arg = JSON.stringify(arg, null, 2);
    }
    console.log(`[${Platform.OS}]`, arg);
  }
}

function thumbnail(url) {
  "Help to upload Imaged by urls.";

  if (!url) {
    return errorPic;
  }

  return {
    uri: "http://" + BaseAddress + url,
  };
}

export default { log, thumbnail };

export const formatChatTime = (date) => {
  if (!date) return "-";

  const now = new Date();
  const target = new Date(date);
  const s = Math.abs(now - target) / 1000;

  if (s < 60) {
    return "now";
  }

  if (s < 3600) {
    const m = Math.floor(s / 60);
    return `${m}m ago`;
  }

  if (s < 86400) {
    const h = Math.floor(s / 3600);
    return `${h}h ago`;
  }

  if (s < 86400 * 7) {
    const d = Math.floor(s / 86400);
    return `${d}d ago`;
  }

  if (s < 86400 * 30) {
    const w = Math.floor(s / (86400 * 7));
    return `${w}w ago`;
  }

  const y = Math.floor(s / (86400 * 365));
  return `${y}y ago`;
};

export const formatAuctionTime = (dateString) => {
  // Parse the input date string
  const eventDate = new Date(dateString);
  const now = new Date();

  // Calculate total difference in milliseconds
  const diff = eventDate - now;

  // Return null if the date is in the past
  if (diff <= 0) return null;

  // Calculate time components
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Format based on remaining time
  if (days > 0) {
    return `${days}:${hours}:${minutes}:${seconds}s`;
  } else if (hours > 0) {
    return `${hours}:${minutes}:${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}:${seconds}s`;
  } else {
    return `${minutes}:${seconds}s`;
  }
};
