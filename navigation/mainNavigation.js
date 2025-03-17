// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createStaticNavigation } from "@react-navigation/native";
// import Onboarding from "../screens/onboardingScreens/Onboarding";
// import LoginScreen from "../screens/authScreens/LoginScreen";
// import SignupScreen from "../screens/authScreens/SignupScreen";
// import HomeScreen from "../screens/homeScreen/HomeScreen";
// import MapScreen from "../screens/rideScreens/mapScreen";
// import CategoriesDisplaySreen from "../screens/shopScreens/CategoriesDisplaySreen";
// import CategoryProductsListScreen from "../screens/shopScreens/CategoryProductsListScreen";
// import ProductDetailsScreen from "../screens/shopScreens/ProductDetailsScreen";
// import CartScreen from "../screens/shopScreens/CartScreen";
// import DeliveryScreen from "../screens/shopScreens/DeliveryScreen";
// import PaymentMethodScreen from "../screens/shopScreens/PaymentMethodScreen";
// import ProfileScreen from "../screens/profileScreen/ProfileScreen";
// import FundWithCardScreen from "../screens/walletScreens/FundWithCardScreen";
// import FundWithUSSDScreen from "../screens/walletScreens/FundWithUSSDScreen";
// import FundWalletScreen from "../screens/walletScreens/FundWalletScreen";

// const mainNavigation = () => {
//   const mainNav = createNativeStackNavigator({
//     screenOptions: { gestureEnabled: true },
//     screens: {
//       Ride: {
//         screen: MapScreen,
//         options: {
//           headerShown: false,
//         },
//       },
//       Shop: {
//         screen: CategoriesDisplaySreen,
//         options: {
//           headerShown: false,
//         },
//       },
//       ProductsList: {
//         screen: CategoryProductsListScreen,
//         options: {
//           headerShown: false,
//         },
//       },
//       ProductDetails: {
//         screen: ProductDetailsScreen,
//         options: {
//           headerShown: false,
//         },
//       },
//       Cart: {
//         screen: CartScreen,
//         options: {
//           headerShown: true,
//         },
//       },
//       DeliveryInfo: {
//         screen: DeliveryScreen,
//       },
//       PaymentMethod: {
//         screen: PaymentMethodScreen,
//       },
//       Profile: {
//         screen: ProfileScreen,
//         options: {
//           headerTitle: "Profile",
//           headerTitleAlign: "center",
//         },
//       },
//       FundWallet: {
//         screen: FundWalletScreen,
//         options: {
//           headerTitle: "Fund Wallet",
//           headerTitleAlign: "center",
//         },
//       },
//       FundWithCard: {
//         screen: FundWithCardScreen,
//         options: {
//           headerTitle: "Fund with debit card",
//           headerTitleAlign: "center",
//         },
//       },
//       FundWithUSSD: {
//         screen: FundWithUSSDScreen,
//         options: {
//           headerTitle: "Fund with USSD code",
//           headerTitleAlign: "center",
//         },
//       },
//     },
//   });

//   const WelcomingNavigation = createNativeStackNavigator({
//     screenOptions: { gestureEnabled: false, headerShown: false },
//     initialRouteName: "Onboarding",
//     screens: {
//       Onboarding: Onboarding,
//       Login: LoginScreen,
//       SignUp: SignupScreen,
//       HomePage: HomeScreen,
//       Main: mainNav,
//     },
//   });

//   const appNav = createStaticNavigation(WelcomingNavigation);
//   return appNav;
// };

// export default mainNavigation;
