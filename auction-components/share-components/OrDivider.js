import { StyleSheet } from "react-native";
import React from "react";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

const OrDivider = () => {
  return (
    <HStack className="flex items-center my-4">
      <Divider className="flex-1" />
      <Text className="font-semibold mx-2">Or</Text>
      <Divider className="flex-1" />
    </HStack>
  );
};

export default OrDivider;

const styles = StyleSheet.create({});
