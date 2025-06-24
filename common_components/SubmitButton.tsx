import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { COLORS } from "@/constants/COLORS";

type SubmitButtonProps = {
  handleSubmit: () => void;
  text: string;
  textColor?: string;
  isDisabled?: boolean;
  showSpinner?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  handleSubmit,
  text,
  textColor = "#000",
  isDisabled = false,
  showSpinner = false,
  size = "sm",
  className = "w-full self-center mt-4",
}) => {
  return (
    <Button
      className={`bg-[${COLORS.primary}] rounded-lg ${className}`}
      size={size}
      onPress={handleSubmit}
      isDisabled={isDisabled}
    >
      {showSpinner ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonText style={{ color: textColor }}>{text}</ButtonText>
          <ActivityIndicator
            size="small"
            color={textColor}
            style={{ marginLeft: 8 }}
          />
        </View>
      ) : (
        <ButtonText style={{ color: textColor }}>{text}</ButtonText>
      )}
    </Button>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({});
