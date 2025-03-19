import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import React, { useCallback } from "react";
import LogInForm from "./LogInForm";
import { VStack } from "@/components/ui/vstack";
import SignInForm from "./SignInForm";
import { TouchableOpacity, useColorScheme } from "react-native";

const GetStartedTabs = () => {
  const [selectedTab, setSelectedTab] = useState("Log In");
  const colorScheme = useColorScheme();
  const activeBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";

  const handleLoginPress = useCallback(() => setSelectedTab("Log In"), []);
  const handleSignUpPress = useCallback(() => setSelectedTab("Sign Up"), []);

  return (
    <VStack className=" flex-1  rounded-t-lg">
      {/* Tab Switcher */}
      <HStack className="mx-6 mt-6 items-center justify-between">
        <HStack className="rounded-full w-full p-1.5 items-center bg-background-100 border border-outline-200">
          <TouchableOpacity
            className={`rounded-full flex-1 justify-center items-center px-3 py-1.5 ${
              selectedTab === "Log In" ? activeBg : "bg-background-100"
            }`}
            onPress={handleLoginPress}
          >
            <Text
              size="sm"
              className={`font-medium ${
                selectedTab === "Log In" ? "text-black" : "text-gray-500"
              }`}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-full flex-1 justify-center items-center px-3 py-1.5 ${
              selectedTab === "Sign Up" ? activeBg : "bg-background-100"
            }`}
            onPress={handleSignUpPress}
          >
            <Text
              size="sm"
              className={`font-medium ${
                selectedTab === "Sign Up" ? "text-black" : "text-gray-500"
              }`}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </HStack>
      </HStack>

      {/* Dynamic Form */}
      {selectedTab === "Log In" ? <LogInForm /> : <SignInForm />}
    </VStack>
  );
};

export default GetStartedTabs;
