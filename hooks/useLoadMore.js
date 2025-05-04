// hooks/useLoadMore.js
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const useLoadMore = ({
  isLoading,
  setIsLoading,
  NextPage,
  isCooldownRef,
  Action,
}) => {
  const dispatch = useDispatch();
  return useCallback(() => {
    if (isLoading || isCooldownRef.current || !NextPage) return;

    console.log("Loading more auctions...", NextPage);
    setIsLoading(true);
    isCooldownRef.current = true;
    dispatch(Action({ page: NextPage }));

    setTimeout(() => {
      isCooldownRef.current = false;
    }, 30 * 1000);
    setIsLoading(false);
  }, [isLoading, NextPage, Action]);
};
