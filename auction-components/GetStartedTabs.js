import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import React from "react";

const GetStartedTabs = () => {
  const [selectedTab, setSelectedTab] = React.useState("Log In");
  return (
    <HStack className="h-20 items-center justify-between">
      <HStack className="rounded-full p-1.5 items-center border border-outline-200">
        <Pressable
          className={`rounded-full px-3 py-1.5 ${
            selectedTab === "Log In" ? "bg-background-100" : "bg-transparent"
          }`}
          onPress={() => setSelectedTab("Log In")}
        >
          <Text size="sm" className="font-medium">
            Log In
          </Text>
        </Pressable>
        <Pressable
          className={`rounded-full px-3 py-1.5 ${
            selectedTab === "Sign Up" ? "bg-background-100" : "bg-transparent"
          }`}
          onPress={() => setSelectedTab("Sign Up")}
        >
          <Text size="sm" className="font-medium">
            Sign Up
          </Text>
        </Pressable>
      </HStack>
    </HStack>
  );
};
export default GetStartedTabs;
