import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  KeyboardAvoidingView,
  Platform,
  // Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import mainNavigation from "./navigation/mainNavigation";
import GetStartedScreen from "./screens/GetStartedScreen";
import { Text } from "./components/ui/text";

export default function App() {
  // const AppNavigator = mainNavigation();
  const colorScheme = useColorScheme(); // Detects light or dark mode

  const isDarkMode = colorScheme === "dark";
  const statusBarStyle = isDarkMode ? "light-content" : "dark-content";

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
      >
        <GluestackUIProvider mode={isDarkMode ? "dark" : "light"}>
          <StatusBar style={statusBarStyle} translucent />
          {/* <View className="p-10 bg-red-300">
            <Text className="text-2xl text-[#259e47]">hi</Text>
          </View> */}

          {/* <AppNavigator /> */}
          <GetStartedScreen />
        </GluestackUIProvider>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
