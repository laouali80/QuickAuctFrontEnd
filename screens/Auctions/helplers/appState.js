// --- helpers/appState.js ---
import { AppState } from "react-native";

export const setupAppStateListener = (handleRefresh, lastActiveRef) => {
  return AppState.addEventListener("change", (nextAppState) => {
    if (
      AppState.currentState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      const now = new Date();
      const last = lastActiveRef.current;
      const diff = (now - last) / (1000 * 60);

      if (diff >= 5) handleRefresh();
    }

    if (nextAppState === "active") {
      lastActiveRef.current = new Date();
    }
  });
};
