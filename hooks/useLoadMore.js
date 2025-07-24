// hooks/useLoadMore.js

export const useLoadMore = ({
  isLoading,
  setIsLoading,
  data,
  isCooldownRef,
  loadMoreAuctions,
  auctionsCount,
  minCountToLoadMore = 4,
  dispatch,
}) => {
  console.log("Loading more auctions...", data.pagination);

  return () => {
    // Only load more if not loading, not in cooldown, has next page, and enough items to fill screen
    if (
      isLoading || // <== Guard against multiple triggers
      isCooldownRef.current || // <== Guard against multiple triggers/
      !data.pagination?.hasMore || // <== Guard loadmore being trigered when hasMore is false
      auctionsCount < minCountToLoadMore || // <== Guard loadmore being trigered when auctionsCount is less than minCountToLoadMore
      auctionsCount === null // <== Guard loadmore being trigered when auctionsCount is null
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
