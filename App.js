import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { KeyboardAvoidingView, Platform, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GetStartedScreen from "./screens/Welcomes/GetStartedScreen";
import { config } from "@gluestack-ui/config"; // <-- import this
import OTPScreen from "./screens/Welcomes/OTPScreen";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Welcomes/HomeScreen";
import InsightsScreen from "./screens/Insights/InsightsScreen";
import ChatsScreen from "./screens/Chats/ChatsScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import { useEffect, useRef, useState } from "react";
import SplashScreen from "./screens/Welcomes/SplashScreen";
import { Provider, useDispatch, useSelector } from "react-redux";
// import AuctionScreen from "./screens/Auctions/AuctionScreen";
import { store, persistor } from "./state/store";
import { getAuthentication } from "./state/reducers/userSlice";
import { PersistGate } from "redux-persist/integration/react";
import SearchScreen from "./screens/Search/SearchScreen";
import ChatScreen from "./screens/Chats/ChatScreen";
// import { Text } from "@/components/ui/text";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import CreationScreen from "./screens/Auction_Creation/CreationScreen";
// import ProductDetailScreen from "./screens/Auctions/AuctionScreen";
import AuctionScreen from "./screens/Auctions/AuctionScreen";
// import NotificationScreen from "./screens/Notification/NotificationsScreen";
import NotificationsScreen from "./screens/Notification/NotificationsScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { showToast, ToastProvider } from "./animation/CustomToast/ToastManager";
import BidHistory from "./screens/Auctions/BidHistoryScreen";
import NetInfo from "@react-native-community/netinfo";

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
  const [showSplash, setShowSplash] = useState(true);
  const authenticated = useSelector(getAuthentication);
  const [networkStatus, setNetworkStatus] = useState(null);
  console.log(authenticated);
  // const authenticated = true;

  const hasInitialized = useRef(false);
  const previousStatus = useRef(null);
  const wasDisconnected = useRef(false); // 🔒 tracks real disconnection

  useEffect(() => {
    if (networkStatus === null) return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return; // skip first trigger
    }

    // then show the toast
  }, [networkStatus]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected !== previousStatus.current) {
        previousStatus.current = state.isConnected;
        setNetworkStatus(state.isConnected);
      }
    });

    return () => {
      unsubscribe(); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    if (networkStatus === null || showSplash) return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return; // skip first trigger after splash
    }

    if (networkStatus) {
      if (wasDisconnected.current) {
        // ✅ Only show restored toast if we've been disconnected before
        showToast({
          text: "📶 Network restored",
          duration: 2000,
          type: "success",
        });
        wasDisconnected.current = false; // reset after restoring
      }
    } else {
      showToast({
        text: "📴 Network lost",
        duration: 2000,
        type: "error",
      });
      wasDisconnected.current = true; // 🔥 mark as disconnected
    }
  }, [networkStatus, showSplash]);

  const isDarkMode = colorScheme === "dark";
  const statusBarStyle = isDarkMode ? "light-content" : "dark-content";

  const handleSplashFinish = () => {
    console.log("Splash screen finished, navigating to next screen");
    setShowSplash(false);
  };

  console.log("Authenticated:", authenticated);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <GluestackUIProvider
            config={config}
            mode={isDarkMode ? "dark" : "light"}
          >
            <NavigationContainer theme={LightTheme}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
              >
                <StatusBar barStyle={statusBarStyle} translucent />
                {/* <View className="bg-blue-600">
              <Text className="text-2xl text-blue-600">test</Text>
            </View> */}

                <Stack.Navigator>
                  {showSplash ? (
                    <>
                      <Stack.Screen
                        name="Splash"
                        options={{ headerShown: false }}
                      >
                        {() => <SplashScreen onFinish={handleSplashFinish} />}
                      </Stack.Screen>
                    </>
                  ) : !authenticated ? (
                    <>
                      <Stack.Screen
                        name="GetStarted"
                        component={GetStartedScreen}
                      />
                      <Stack.Screen name="OTP" component={OTPScreen} />
                    </>
                  ) : (
                    <>
                      <Stack.Screen name="Home" component={HomeScreen} />
                      <Stack.Screen name="Search" component={SearchScreen} />

                      {/* Auction */}
                      <Stack.Screen name="Auction" component={AuctionScreen} />
                      {/* <Stack.Screen
                    name="Auction"
                    component={ProductDetailScreen}
                  /> */}
                      <Stack.Screen name="BidHistory" component={BidHistory} />

                      {/* Auction Creation */}
                      <Stack.Screen
                        name="AuctionCreation"
                        component={CreationScreen}
                      />

                      <Stack.Screen name="Chat" component={ChatScreen} />

                      <Stack.Screen name="Chats" component={ChatsScreen} />
                      <Stack.Screen name="Profile" component={ProfileScreen} />
                      <Stack.Screen
                        name="Notifications"
                        component={NotificationsScreen}
                      />
                    </>
                  )}
                </Stack.Navigator>
              </KeyboardAvoidingView>
            </NavigationContainer>
          </GluestackUIProvider>
        </ToastProvider>
      </GestureHandlerRootView>
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

// function AppContent() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ToastProvider>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <TouchableOpacity
//             onPress={() => {
//               showToast({
//                 text: "work Message",
//                 duration: 2000,
//                 type: "error",
//               });
//             }}
//             style={{
//               height: 50,
//               width: "90%",
//               borderColor: "black",
//               borderWidth: 1,
//             }}
//           >
//             <Text>Success</Text>
//           </TouchableOpacity>
//         </View>
//       </ToastProvider>
//     </GestureHandlerRootView>
//   );
// }
