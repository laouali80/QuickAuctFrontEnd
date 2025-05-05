import { StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "@/constants/COLORS";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

const DescriptionInput = ({ value, handleUpdDescrip }) => {
  return (
    <Textarea
      size="md"
      isReadOnly={false}
      isInvalid={false}
      isDisabled={false}
      className="w-full"
      style={{
        borderColor: COLORS.silverIcon,
        borderWidth: 1,
      }}
    >
      <TextareaInput
        style={{ color: "black" }}
        placeholder="Your text goes here..."
        value={value}
        onChangeText={handleUpdDescrip}
      />
    </Textarea>
  );
};

export default DescriptionInput;

const styles = StyleSheet.create({});
