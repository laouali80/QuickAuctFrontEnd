import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
// import {  EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import React, { useEffect, useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useColorScheme } from "react-native";

interface CustomInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "email";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  showTogglePassword?: boolean;
  showPassword?: boolean;
  setShowPassword?: (val: boolean) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  inputColor?: string;
  helperMessage?: string;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  type = "text",
  autoCapitalize = "none",
  secureTextEntry = false,
  showTogglePassword = false,
  showPassword,
  setShowPassword,
  isInvalid = false,
  errorMessage = "",
  inputColor,
  helperMessage,
}) => {
  const colorScheme = useColorScheme();
  const inputTextColor =
    inputColor || (colorScheme === "dark" ? "#8c8c8c" : "#262627");

  return (
    <FormControl isInvalid={isInvalid} size="md">
      <FormControlLabel>
        <FormControlLabelText
          style={{ color: colorScheme === "dark" ? "#262627" : "#8c8c8c" }}
        >
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Input className="min-w-[250px]">
        <InputField
          type={showTogglePassword && !showPassword ? "password" : "text"}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry && !showPassword}
          style={{ color: inputTextColor }}
        />
        {showTogglePassword && setShowPassword && (
          <InputSlot
            className="pr-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        )}
      </Input>

      {isInvalid && errorMessage ? (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      ) : null}

      {helperMessage && (
        <FormControlHelper>
          <FormControlHelperText>
            {helperMessage}
            {/* {Password must be at least 6 characters.} */}
          </FormControlHelperText>
        </FormControlHelper>
      )}
    </FormControl>
  );
};

export default CustomInputField;
