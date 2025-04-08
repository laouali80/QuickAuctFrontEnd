import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { KeyboardAvoidingView, Platform, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GetStartedScreen from "./screens/Welcomes/GetStartedScreen";

import OTPScreen from "./screens/Welcomes/OTPScreen";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Welcomes/HomeScreen";
import InsightsScreen from "./screens/Insights/InsightsScreen";
import ChatsScreen from "./screens/Chats/ChatsScreen";
import CreationScren from "./screens/Creation/CreationScren";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import { useEffect, useState } from "react";
import SplashScreen from "./screens/Welcomes/SplashScreen";
import { Provider, useDispatch, useSelector } from "react-redux";
import AuctionOverviewScreen from "./screens/Auctions/AuctionOverviewScreen";
import CreateAuctionFormScreen from "./screens/Auctions/CreateAuctionFormScreen";
import AuctionBidsScreen from "./screens/Auctions/AuctionBidsScreen";
import AuctionScreen from "./screens/Auctions/AuctionScreen";
import { store, persistor } from "./state/store";
import { getAuthentication } from "./state/reducers/userSlice";
import { PersistGate } from "redux-persist/integration/react";
import SearchScreen from "./screens/Search/SearchScreen";

const Stack = createNativeStackNavigator();

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

function AppContent() {
  const colorScheme = useColorScheme(); // Detects light or dark mode
  const [initialized] = useState(true);
  const authenticated = useSelector(getAuthentication);
  console.log(authenticated);
  // const authenticated = true;

  const isDarkMode = colorScheme === "dark";
  const statusBarStyle = isDarkMode ? "light-content" : "dark-content";

  useEffect(() => {
    console.log("Authenticated:", authenticated);
  }, [authenticated]);

  // const [initialized] = useState(true);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={isDarkMode ? "dark" : "light"}>
        <NavigationContainer theme={LightTheme}>
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
                  <Stack.Screen name="Search" component={SearchScreen} />

                  {/* Auction */}
                  <Stack.Screen name="Auction" component={AuctionScreen} />
                  <Stack.Screen
                    name="AuctionBids"
                    component={AuctionBidsScreen}
                  />
                  <Stack.Screen
                    name="AuctionOverview"
                    component={AuctionOverviewScreen}
                  />

                  {/* Auction Creation */}
                  <Stack.Screen
                    name="CreateAuctionForm"
                    component={CreateAuctionFormScreen}
                  />

                  {/* <Stack.Screen name="Chats" component={ChatsScreen} />
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

export default function App() {
  return (
    <Provider store={store}>
      {/* PersistGate is to rehydrate the app when reloading again with the previous store state */}
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
