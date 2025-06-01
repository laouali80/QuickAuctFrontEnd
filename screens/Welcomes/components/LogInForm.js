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
// import {  EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import React, { useEffect, useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Keyboard, Platform, Pressable } from "react-native";
import SubmitButton from "../../../common_components/SubmitButton";
import OrDivider from "../../../common_components/OrDivider";
import SocialsButton from "./SocialsButton";
import api, { apiRequest, login } from "@/api/axiosInstance";
import utils from "@/core/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  getMessage,
  getStatus,
  logInUser,
  setAuthenticated,
} from "@/state/reducers/userSlice";
import secure from "@/storage/secure";
import { persistor } from "@/state/store";
import { showToast } from "@/animation/CustomToast/ToastManager";

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

  // const login = async (email, password) => {
  //   const response = await fetch(
  //     "http://localhost:8000/api/users/auth/login/",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     }
  //   );

  //   if (response.ok) {
  //     // const { token } = await response.json();
  //     const resp = await response.json();
  //     console.log(resp);
  //     // return token;
  //   }
  //   const errMessage = await response.json();
  //   console.log(errMessage);
  //   // throw new Error(errMessage.detail);
  // };
  const dispatch = useDispatch(); // Get dispatch function
  const loginMssg = useSelector(getMessage);
  const loginStatus = useSelector(getStatus);

  useEffect(() => {
    if (!loginMssg || !loginStatus) return;
    if (loginMssg) {
      showToast({
        text: loginMssg,
        duration: 2000,
        type: loginStatus,
      });
    }
    if (loginStatus === "success") {
      setTimeout(() => {
        dispatch(setAuthenticated(true)); // separate action to update auth state
      }, 2000); // wait for toast to show before navigating
    }

    dispatch(clearMessage());
  }, [loginMssg, loginStatus]);

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log("Login attempt with:", { email, password });

      // Dispatch the action correctly
      dispatch(logInUser({ email: email.toLowerCase(), password }));
    }
  };

  const renderView = (children) => {
    // console.log(Platform.OS);
    return Platform.OS !== "web" ? (
      <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
    ) : (
      children
    );
  };

  return renderView(
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
  );
};

export default LogInForm;
