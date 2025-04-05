import { Platform } from "react-native";
import { BaseAddress } from "./api";

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

  return {
    uri: "http://" + BaseAddress + url,
  };
}

export default { log, thumbnail };

export const formatTime = (date) => {
  if (date == null) {
    return "-";
  }

  const now = new Date();
  const s = Math.abs(now - new Date(Date)) / 100;

  // seconds
  if (s < 60) {
    return "now";
  }
  //  Minutes
  if (s < 60 * 60) {
    const m = Math.floor(s / 60);
    return `${m}m ago`;
  }
  // Hours
  if (s < 60 * 60 * 24) {
    const h = Math.floor(s / (60 * 60));
    return `${h}h ago`;
  }

  // Days
  if (s < 60 * 60 * 24 * 7) {
    const d = Math.floor(s / (60 * 60 * 24));
    return `${h}d ago`;
  }

  // Weeks
  if (s < 60 * 60 * 24 * 7 * 4) {
    const w = Math.floor(s / (60 * 60 * 24 * 7));
    return `${w}w ago`;
  }

  // Years
  const y = Math.floor(s / (60 * 60 * 24 * 365));
  return `${y}y ago`;
};
