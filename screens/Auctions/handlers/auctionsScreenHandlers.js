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
  selectedCategory,
  auctionsList,
  newAuctionsCount,
  minCountToLoadMore = 7
) => {
  const hasEnoughData = auctionsList?.length >= minCountToLoadMore;

  const shouldRefresh = newAuctionsCount > 0 || !hasEnoughData;

  if (!shouldRefresh) {
    console.log("⛔ Skipping refresh — not enough data and no new updates.");
    return;
  }

  console.log("🔄 Refreshing auctions...");

  setRefreshing(true);
  try {
    await dispatch(
      fetchAuctions({ page: 1, category: selectedCategory })
    ).unwrap();

    // Reset badge notification count
    dispatch(resetNewAuctionsBadge());
  } catch (error) {
    console.error("❌ Refresh failed:", error);
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

// ✅ Pure function version
export const getLoadMoreHandler = ({
  isLoading,
  setIsLoading,
  data,
  isCooldownRef,
  loadMoreAuctions,
  auctionsCount,
  minCountToLoadMore = 4,
  dispatch, // you must pass it in
}) => {
  console.log("Loading more auctions...", data.pagination);

  return () => {
    if (
      isLoading ||
      isCooldownRef.current ||
      !data.pagination?.hasMore ||
      auctionsCount < minCountToLoadMore ||
      auctionsCount === null
    )
      return;

    setIsLoading(true);
    isCooldownRef.current = true;

    dispatch(
      loadMoreAuctions({
        page: data.pagination.next,
        ...data,
      })
    );

    setTimeout(() => {
      isCooldownRef.current = false;
    }, 30 * 1000);

    setIsLoading(false);
  };
};
