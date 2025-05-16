// --- helpers/location.js ---
import * as Location from "expo-location";

export const fetchCurrentLocationString = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }

  let location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
    timeout: 15000,
  });

  const [geo] = await Location.reverseGeocodeAsync(location.coords);
  if (!geo) throw new Error("Could not determine your location");

  return `${geo.city || "Unknown"}, ${geo.region || "Unknown"}`;
};
