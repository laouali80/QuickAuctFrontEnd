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
import { Keyboard, Platform, Pressable, useColorScheme } from "react-native";
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
import CustomInputField from "@/common_components/CustomInputField";
import NetInfo from "@react-native-community/netinfo";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;

    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
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
    // help to detect network status
    const netState = await NetInfo.fetch();

    if (validateForm()) {
      console.log("Login attempt with:", { email, password });

      if (!netState.isConnected || !netState.isInternetReachable) {
        console.warn("📴 Device offline. Cannot requests.");
        showToast({
          text: "📴 Please connect to the internet",
          duration: 2000,
          type: "error",
        });
        return;
      }
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
      <FormControl
        isInvalid={!!emailError || !!passwordError}
        size="md"
        className="gap-y-4"
      >
        {/* Email Field */}
        <VStack space="xs">
          <CustomInputField
            label="Email"
            type="text"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            isInvalid={!!emailError}
            errorMessage={emailError}
          />
        </VStack>

        {/* Password Field */}
        <VStack space="xs">
          <CustomInputField
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            autoCapitalize="none"
            showTogglePassword={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isInvalid={!!passwordError}
            errorMessage={passwordError}
            helperMessage="Password must be at least 6 characters."
          />
        </VStack>
      </FormControl>

      {/* Login Button */}
      <SubmitButton
        handleSubmit={handleSubmit}
        text="Log In"
        textColor="white"
        isDisabled={!email || !password || loginStatus === "pending"}
        showSpinner={loginStatus === "pending" ? true : false}
      />

      {/* OR Divider */}
      <OrDivider />

      {/* Social Buttons */}
      <SocialsButton />
    </VStack>
  );
};

export default LogInForm;
