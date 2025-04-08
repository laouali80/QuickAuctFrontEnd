import { StyleSheet } from "react-native";
import React from "react";
import { Button, ButtonText } from "@/components/ui/button";

const SubmitButton = ({ handleSubmit, text, isDisabled }) => {
  return (
    <Button
      className="w-full self-center mt-4 bg-[#259e47] rounded-lg"
      size="sm"
      onPress={handleSubmit}
      isDisabled={isDisabled}
    >
      <ButtonText>{text}</ButtonText>
    </Button>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({});
