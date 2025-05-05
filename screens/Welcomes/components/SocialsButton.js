import { StyleSheet, Text } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { AntDesign } from "@expo/vector-icons";

const SocialsButton = () => {
  return (
    <VStack space="sm" className="mt-auto">
      <Box className="p-4 border border-outline-200 rounded-full flex-row items-center justify-center">
        <AntDesign name="google" size={20} color="black" />
        <Text className="ml-2">Continue with Google</Text>
      </Box>
      <Box className="p-4 border border-outline-200 rounded-full flex-row items-center justify-center">
        <AntDesign name="apple1" size={20} color="black" />
        <Text className="ml-2">Continue with Apple</Text>
      </Box>
    </VStack>
  );
};

export default SocialsButton;

const styles = StyleSheet.create({});
