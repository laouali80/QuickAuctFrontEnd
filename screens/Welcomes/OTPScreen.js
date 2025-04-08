import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { EditIcon, Icon, RefreshCwIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const OTPScreen = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For resetting the timer
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const resetTimer = () => {
    setKey((prevKey) => prevKey + 1);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100); // Restart animation
  };

  return (
    <View className="flex-1 justify-between px-5">
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
        <Text className="text-2xl font-semibold my-5">testuser@gmail.com</Text>

        <Button
          size="lg"
          className="w-1/2 bg-white border border-indigo-600 self-center mt-6 rounded-full"
        >
          <Icon as={EditIcon} size="md" />
          <ButtonText className="text-gray-700">Modify Email</ButtonText>
        </Button>

        {/* OTP Inputs */}
        <HStack space="xl" className="mt-8 py-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="rounded-lg font-semibold text-center"
              style={styles.input}
              textContentType="oneTimeCode"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              autoFocus={index === 0}
            />
          ))}
        </HStack>

        {/* Countdown Timer & Resend Button */}
        <View className="items-center mt-6">
          <CountdownCircleTimer
            key={key}
            isPlaying={isPlaying}
            duration={30} // 30 seconds
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[20, 10, 5, 0]}
            onComplete={() => ({ shouldRepeat: false })}
          >
            {({ remainingTime, color }) => {
              const minutes = Math.floor(remainingTime / 60);
              const seconds = remainingTime % 60;
              return (
                <Text style={{ color, fontSize: 24, textAlign: "center" }}>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  {"\n"}
                  remaining
                </Text>
              );
            }}
          </CountdownCircleTimer>

          {/* Resend OTP Button */}
          <TouchableOpacity
            onPress={resetTimer}
            className="flex-row items-center mt-4"
          >
            <Icon as={RefreshCwIcon} size="md" className="text-indigo-600" />
            <Text className="text-indigo-600 font-semibold ml-2">
              Send Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
