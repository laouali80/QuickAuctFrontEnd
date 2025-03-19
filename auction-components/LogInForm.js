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
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import SubmitButton from "./share-components/SubmitButton";
import OrDivider from "./share-components/OrDivider";
import SocialsButton from "./share-components/SocialsButton";

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

      // Make a request
      api({
        method: "POST",
        url: "api/users/auth/login/",
        data: { email, password },
      })
        .then((response) => {
          console.log("login", response);
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss}>
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
                autoCapitalize="none"
                autoFocus={false}
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
        <SubmitButton
          handleSubmit={handleSubmit}
          text="Log In"
          isDisabled={!email || !password}
        />

        {/* OR Divider */}
        <OrDivider />

        {/* Social Buttons */}
        <SocialsButton />
      </VStack>
    </Pressable>
  );
};

export default LogInForm;
