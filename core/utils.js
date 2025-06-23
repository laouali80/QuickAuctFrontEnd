import { Platform } from "react-native";
import errorPic from "../assets/errors/error.jpg";
import { BaseAddress } from "@/constants/config";

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

  // Accepts either a static image (require) or a relative/absolute URL string.
  if (!url) return errorPic;
  // console.log("url type: ", typeof require("../assets/auctions/auct1.jpg"));
  // console.log("url type: ", typeof url);

  if (typeof url !== "string") {
    // Handle local static images like require("...")
    return url;
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
  } else if (seconds > 0) {
    return `${minutes}:${seconds}s`;
  }

  return "Completed";
};

export const formatDate = (isoDateString) => {
  // Create a Date object from the ISO string
  const date = new Date(isoDateString);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Return in DD/MM/YYYY format
  return `${day}/${month}/${year}`;
};
