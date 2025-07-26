import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { EditIcon, Icon, RefreshCwIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useNavigation } from "@react-navigation/native";
import SubmitButton from "@/common_components/SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  EmailVerification,
  getMessage,
  getStatus,
  OTPValidation,
  setAuthenticated,
  signUpUser,
} from "@/state/reducers/userSlice";
import { COLORS } from "@/constants/COLORS";
import { useDebounce } from "@/hooks/useDebouce";
import { MaterialIcons } from "@expo/vector-icons";
import OTPModal from "./components/OTPModal";
import { showToast } from "@/animation/CustomToast/ToastManager";

const OTPScreen = ({ route }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For resetting the timer
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const dispatch = useDispatch(); // Get dispatch function
  const colorScheme = useColorScheme();
  const formData = route.params;
  const BottomModalRef = useRef();

  const signupMssg = useSelector(getMessage);
  const signupStatus = useSelector(getStatus);

  useEffect(() => {
    if (!signupMssg || !signupStatus) return;
    if (signupMssg) {
      showToast({
        text: signupMssg,
        duration: 2000,
        type: signupStatus,
      });
    }
    if (
      signupStatus === "success" &&
      signupMssg === "Successful Registration"
    ) {
      setTimeout(() => {
        dispatch(setAuthenticated(true)); // separate action to update auth state
      }, 2000); // wait for toast to show before navigating
    } else if (signupMssg === "Invalid OTP") {
      BottomModalRef.current?.open();
    }

    dispatch(clearMessage());
  }, [signupMssg, signupStatus]);

  useDebounce(
    () => {
      const isComplete = otp.every((val) => val !== "");
      if (isComplete) {
        // console.log("complet");
        verifyOTP();
      }
    },
    500,
    [otp]
  );

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // console.log("Form submitted:", formData);

  const resetTimer = () => {
    dispatch(
      EmailVerification({
        email: formData.email.toLowerCase(),
      })
    );
    setKey((prevKey) => prevKey + 1);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100); // Restart animation
  };

  const verifyOTP = () => {
    const fullOtp = otp.toString().replace(/,/g, "");
    // console.log("fullOtp: ", fullOtp);
    dispatch(OTPValidation({ otp: fullOtp }))
      .unwrap()
      .then(() => {
        // OTP verified, proceed to register user
        console.log("now create acount........");
        setTimeout(() => {
          dispatch(
            signUpUser({
              email: formData.email.toLowerCase(),
              ...formData,
            })
          );
        }, 3000);
      })
      .catch((err) => {
        console.log("OTP validation failed:", err);
        // Show error to user
      });
  };

  return (
    <ScrollView
      className="px-5"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
    >
      <View className="justify-center items-center flex-1">
        <Image
          source={require("../../assets/icons/OTPImag.png")}
          style={styles.image}
        />
        <Text className="text-3xl font-bold my-5">OTP Verification</Text>
        <Text className="text-center px-4">
          We have sent a one-time password (OTP) to your registered email.
          Please enter it below to continue.
        </Text>
        <Text className="text-2xl font-semibold mt-5">{formData.email}</Text>

        <Button
          size="lg"
          className="w-min-[50%] bg-white border border-outline-200 self-center mt-3 rounded-full"
        >
          <Icon as={EditIcon} size="md" color={COLORS.red} />
          <ButtonText
            className="text-gray-700"
            onPress={() => navigation.goBack()}
          >
            Modify Email
          </ButtonText>
        </Button>

        {/* OTP Inputs */}
        <HStack space="xl" className="py-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="rounded-full font-semibold text-center"
              style={[styles.input, { color: "#262627" }]}
              textContentType="oneTimeCode"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              autoFocus={index === 0}
            />
          ))}
        </HStack>

        {/* <SubmitButton
          handleSubmit={verifyOTP}
          text="Log In"
          // isDisabled={!email || !password}
        /> */}

        {/* Countdown Timer & Resend Button */}
        <View className="items-center mt-6">
          <CountdownCircleTimer
            key={key}
            isPlaying={isPlaying}
            duration={900} // 30 seconds
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[20, 10, 5, 0]}
            onComplete={() => ({ shouldRepeat: false })}
          >
            {({ remainingTime, color }) => {
              const minutes = Math.floor(remainingTime / 60);
              const seconds = remainingTime % 60;
              return remainingTime > 0 ? (
                <Text style={{ color, fontSize: 24, textAlign: "center" }}>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  {"\n"}
                  remaining
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={resetTimer}
                  className="flex-row items-center mt-4"
                >
                  <MaterialIcons
                    name="refresh"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text className="text-indigo-600 font-semibold ml-2">
                    Send Again
                  </Text>
                </TouchableOpacity>
              );
            }}
          </CountdownCircleTimer>

          {/* Resend OTP Button */}
        </View>

        <OTPModal
          ref={BottomModalRef}
          tryAgain={() => {
            BottomModalRef.current?.close();
            resetTimer();
          }}
        />
      </View>
    </ScrollView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
  },
  input: {
    backgroundColor: "#E5E7EB",
    width: 55,
    height: 55,
    borderRadius: 10,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
});
