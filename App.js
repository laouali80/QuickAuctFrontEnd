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
import { Provider } from "react-redux";
import AuctionOverviewScreen from "./screens/AuctionOverviewScreen";
import CreateAuctionFormScreen from "./screens/CreateAuctionFormScreen";
import AuctionBidsScreen from "./screens/AuctionBidsScreen";
import AuctionScreen from "./screens/AuctionScreen";
import store from "./state/store";

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme(); // Detects light or dark mode

  const isDarkMode = colorScheme === "dark";
  const statusBarStyle = isDarkMode ? "light-content" : "dark-content";

  const [initialized] = useState(true);
  const [authenticated] = useState(true);

  return (
    <Provider store={store}>
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

                    {/* Auction */}
                    {/* <Stack.Screen name="Auction" component={AuctionScreen} />
                    <Stack.Screen
                      name="AuctionBids"
                      component={AuctionBidsScreen}
                    />
                    <Stack.Screen
                      name="AuctionOverview"
                      component={AuctionOverviewScreen}
                    /> */}

                    {/* Auction Creation */}
                    {/* <Stack.Screen
                      name="CreateAuctionForm"
                      component={CreateAuctionFormScreen}
                    /> */}

                    {/* <Stack.Screen name="Chats" component={ChatsScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} /> */}
                  </>
                )}
              </Stack.Navigator>
            </KeyboardAvoidingView>
          </NavigationContainer>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
