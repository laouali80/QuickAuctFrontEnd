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
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
} from "@/components/ui/icon";
import React, { useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { ScrollView, Pressable } from "react-native";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { AntDesign } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    let newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email.includes("@"))
      newErrors.email = "Invalid email address.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <ScrollView>
      <VStack className="w-full p-4">
        <FormControl isInvalid={!!errors.firstName}>
          <VStack space="xs">
            <Text className="text-typography-500">First Name</Text>
            <Input className="min-w-[250px]">
              <InputField
                type="text"
                value={formData.firstName}
                onChangeText={(text) => handleChange("firstName", text)}
              />
            </Input>
            {errors.firstName && (
              <FormControlErrorText>{errors.firstName}</FormControlErrorText>
            )}
          </VStack>
        </FormControl>

        <FormControl isInvalid={!!errors.lastName}>
          <VStack space="xs">
            <Text className="text-typography-500">Last Name</Text>
            <Input className="min-w-[250px]">
              <InputField
                type="text"
                value={formData.lastName}
                onChangeText={(text) => handleChange("lastName", text)}
              />
            </Input>
            {errors.lastName && (
              <FormControlErrorText>{errors.lastName}</FormControlErrorText>
            )}
          </VStack>
        </FormControl>

        <FormControl isInvalid={!!errors.username}>
          <VStack space="xs">
            <Text className="text-typography-500">Username</Text>
            <Input className="min-w-[250px]">
              <InputField
                type="text"
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
              />
            </Input>
            {errors.username && (
              <FormControlErrorText>{errors.username}</FormControlErrorText>
            )}
          </VStack>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <VStack space="xs">
            <Text className="text-typography-500">Email</Text>
            <Input className="min-w-[250px]">
              <InputField
                type="text"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </Input>
            {errors.email && (
              <FormControlErrorText>{errors.email}</FormControlErrorText>
            )}
          </VStack>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <VStack space="xs">
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="text-center">
              <InputField
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <InputSlot
                className="pr-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
            {errors.password && (
              <FormControlErrorText>{errors.password}</FormControlErrorText>
            )}
          </VStack>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <VStack space="xs">
            <FormControlLabel>
              <FormControlLabelText>Confirm Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="text-center">
              <InputField
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
              />
              <InputSlot
                className="pr-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
            {errors.confirmPassword && (
              <FormControlErrorText>
                {errors.confirmPassword}
              </FormControlErrorText>
            )}
          </VStack>
        </FormControl>

        <Checkbox
          size="md"
          isChecked={formData.termsAccepted}
          onChange={() =>
            handleChange("termsAccepted", !formData.termsAccepted)
          }
        >
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel>I agree to terms and conditions</CheckboxLabel>
        </Checkbox>
        {errors.termsAccepted && (
          <FormControlErrorText>{errors.termsAccepted}</FormControlErrorText>
        )}

        <Button
          className="w-fit self-center mt-4"
          size="sm"
          onPress={handleSubmit}
        >
          <ButtonText>Sign Up</ButtonText>
        </Button>

        <HStack className="items-center">
          <Divider className="w-full" />
          <Text className="font-semibold mx-2">Or</Text>
          <Divider className="w-full" />
        </HStack>

        <VStack space="sm" className="mt-4">
          <Pressable className="p-4 border border-outline-200 rounded-full flex-row items-center justify-center">
            <AntDesign name="google" size={24} color="black" />
            <Text className="ml-2">Continue with Google</Text>
          </Pressable>
          <Pressable className="p-4 border border-outline-200 rounded-full flex-row items-center justify-center">
            <AntDesign name="apple1" size={24} color="black" />
            <Text className="ml-2">Continue with Apple</Text>
          </Pressable>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default SignInForm;
