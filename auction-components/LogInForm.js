import { Button, ButtonText } from "@/components/ui/button";
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
import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import React, { useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { AntDesign } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      setIsInvalid(true);
      return false;
    } else if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setIsInvalid(true);
      return false;
    }
    setIsInvalid(false);
    setErrorMessage("");
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Login successful with:", { email, password });
      // Handle login API call here
    }
  };

  return (
    <VStack className="px-8 py-4">
      <FormControl isInvalid={isInvalid} size="md" className="gap-y-4">
        {/* Email Field */}
        <VStack space="xs">
          <Text className="text-typography-500">Email</Text>
          <Input className="min-w-[250px]">
            <InputField
              type="text"
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
            />
          </Input>
        </VStack>

        {/* Password Field */}
        <VStack space="xs">
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input className="min-w-[250px]">
            <InputField
              type={showPassword ? "text" : "password"}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Enter your password"
            />
            <InputSlot
              className="pr-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>

          {isInvalid && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errorMessage}</FormControlErrorText>
            </FormControlError>
          )}

          <FormControlHelper>
            <FormControlHelperText>
              Password must be at least 6 characters.
            </FormControlHelperText>
          </FormControlHelper>
        </VStack>
      </FormControl>

      {/* Login Button */}
      {/* <Box space="lg" className="pt-4"> */}
      <Button
        className="w-full self-center mt-4 bg-[#259e47] rounded-lg"
        size="sm"
        onPress={handleSubmit}
        isDisabled={!email || !password}
      >
        <ButtonText>Log In</ButtonText>
      </Button>
      {/* </Box> */}

      {/* OR Divider */}
      <HStack className="flex items-center my-4">
        <Divider className="flex-1" />
        <Text className="font-semibold mx-2">Or</Text>
        <Divider className="flex-1" />
      </HStack>

      {/* Social Login Buttons */}
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
    </VStack>
  );
};

export default LogInForm;
