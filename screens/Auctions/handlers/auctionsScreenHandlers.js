import { useLoadMore } from "@/hooks/useLoadMore";
import { fetchAuctions } from "@/state/reducers/auctionsSlice";
import { setLocation } from "@/state/reducers/userSlice";
import * as Location from "expo-location";

export const fetchAndSetCurrentLocation = async (
  user,
  dispatch,
  setErrorMsg
) => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 15000,
    });

    let reverseGeoCode = await Location.reverseGeocodeAsync(location.coords);
    if (!reverseGeoCode?.length) {
      setErrorMsg("Could not determine your location");
      return;
    }

    const { city, region } = reverseGeoCode[0];
    const stringLocation = `${city || "Unknown"}, ${region || "Unknown"}`;

    if (user.location !== stringLocation) {
      // console.log(stringLocation);
      dispatch(setLocation({ location: stringLocation }));
    }
  } catch (error) {
    console.error("Location error:", error);
    setErrorMsg("Failed to get location: " + error.message);
  }
};

// pulling up refresh
export const handleRefresh = async (
  setRefreshing,
  dispatch,
  selectedCategory
) => {
  // console.log("reach up refresh");
  setRefreshing(true);
  try {
    await dispatch(
      fetchAuctions({ page: 1, category: selectedCategory })
    ).unwrap();
  } catch (error) {
    console.error("Refresh failed:", error);
  } finally {
    setRefreshing(false);
  }
};

// use to load more auction when reach end of the list
// export const handleLoadMore = (
//   isLoading,
//   setIsLoading,
//   NextPage,
//   selectedCategory,
//   isCooldownRef,
//   loadMore
// ) =>
//   useLoadMore({
//     isLoading,
//     setIsLoading,
//     data: { page: NextPage, category: selectedCategory },
//     isCooldownRef,
//     Action: loadMore,
//   });
