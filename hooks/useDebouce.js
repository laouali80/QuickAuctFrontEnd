import { useEffect } from "react";

export const useDebounce = (callback, delay, deps) => {
  useEffect(() => {
    // console.log("states: ", state);
    const handler = setTimeout(() => callback(), delay);
    return () => clearTimeout(handler);
  }, [...(deps || [])]);
};
