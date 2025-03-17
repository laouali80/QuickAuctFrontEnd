import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import React from "react";
import LogInForm from "./LogInForm";
import { VStack } from "@/components/ui/vstack";
import SignInForm from "./SignInForm";
import { ScrollView } from "react-native";

const GetStartedTabs = () => {
  const [selectedTab, setSelectedTab] = React.useState("Log In");

  return (
    <VStack className=" flex-1  rounded-t-lg">
      <HStack className="mx-6 mt-6 items-center justify-between">
        <HStack className="rounded-full w-full p-1.5 items-center bg-background-100 border border-outline-200">
          <Pressable
            className={`rounded-full flex-1 justify-center items-center px-3 py-1.5 ${
              selectedTab === "Log In" ? "bg-white" : "bg-background-100"
            }`}
            onPress={() => setSelectedTab("Log In")}
          >
            <Text size="sm" className="font-medium">
              Log In
            </Text>
          </Pressable>
          <Pressable
            className={`rounded-full flex-1 justify-center items-center px-3 py-1.5 ${
              selectedTab === "Sign Up" ? "bg-white" : "bg-background-100"
            }`}
            onPress={() => setSelectedTab("Sign Up")}
          >
            <Text size="sm" className="font-medium">
              Sign Up
            </Text>
          </Pressable>
        </HStack>
      </HStack>

      {selectedTab === "Log In" ? <LogInForm /> : <SignInForm />}
    </VStack>
  );
};

export default GetStartedTabs;
