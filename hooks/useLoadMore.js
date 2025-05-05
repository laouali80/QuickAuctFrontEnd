// hooks/useLoadMore.js
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const useLoadMore = ({
  isLoading,
  setIsLoading,
  data,
  isCooldownRef,
  Action,
}) => {
  const dispatch = useDispatch();
  return useCallback(() => {
    if (isLoading || isCooldownRef.current || !data.page) return;

    console.log("Loading more auctions...", data.page);
    setIsLoading(true);
    isCooldownRef.current = true;
    dispatch(Action(data));

    setTimeout(() => {
      isCooldownRef.current = false;
    }, 30 * 1000);
    setIsLoading(false);
  }, [isLoading, data.page, Action]);
};
