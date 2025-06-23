import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { Button, ButtonText } from "@/components/ui/button";

const SubmitButton = ({
  handleSubmit,
  text,
  textColor = "black",
  isDisabled,
  showSpinner = false,
}) => {
  return (
    <Button
      className="w-full self-center mt-4 bg-[#259e47] rounded-lg"
      size="sm"
      onPress={handleSubmit}
      isDisabled={isDisabled}
    >
      {showSpinner ? (
        <ButtonText
          style={{
            color: textColor,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {text}{" "}
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </ButtonText>
      ) : (
        <ButtonText style={{ color: textColor }}>{text}</ButtonText>
      )}
    </Button>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({});
