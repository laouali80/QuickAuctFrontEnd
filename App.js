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

import GetStartedScreen from "./screens/GetStartedScreen";
import { Text } from "./components/ui/text";
import OTPScreen from "./screens/OTPScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import InsightsScreen from "./screens/Insights/InsightsScreen";
import ChatsScreen from "./screens/Chats/ChatsScreen";
import CreationScren from "./screens/Creation/CreationScren";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import { useState } from "react";
import SplashScreen from "./screens/SplashScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme(); // Detects light or dark mode

  const isDarkMode = colorScheme === "dark";
  const statusBarStyle = isDarkMode ? "light-content" : "dark-content";

  const [initialized] = useState(true);
  const [authenticated] = useState(false);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={isDarkMode ? "dark" : "light"}>
        <NavigationContainer>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          >
            <StatusBar barStyle={statusBarStyle} translucent />
            <Stack.Navigator>
              {!initialized ? (
                <>
                  <Stack.Screen name="Splash" component={SplashScreen} />
                </>
              ) : !authenticated ? (
                <>
                  <Stack.Screen
                    name="GetStarted"
                    component={GetStartedScreen}
                  />
                  <Stack.Screen name="OTP Verication" component={OTPScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  {/* <Stack.Screen name="Insights" component={InsightsScreen} />
                  <Stack.Screen name="Creation" component={CreationScren} />
                  <Stack.Screen name="Chats" component={ChatsScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} /> */}
                </>
              )}
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
