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
import { AlertCircleIcon } from "@/components/ui/icon";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import React from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";

const LogInForm = () => {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("12345");
  const handleSubmit = () => {
    if (inputValue.length < 6) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  return (
    <VStack className="w-full w-full  p-4">
      <FormControl
        isInvalid={isInvalid}
        size="md"
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
      >
        <VStack space="xs">
          <Text className="text-typography-500">Email</Text>
          <Input className="min-w-[250px]">
            <InputField type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input className="text-center">
            <InputField type={showPassword ? "text" : "password"} />
            <InputSlot className="pr-3" onPress={handleState}>
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>

          <FormControlHelper>
            <FormControlHelperText>
              Must be atleast 6 characters.
            </FormControlHelperText>
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              Atleast 6 characters are required.
            </FormControlErrorText>
          </FormControlError>
        </VStack>
      </FormControl>

      <Button
        className="w-fit self-center mt-4"
        size="sm"
        onPress={handleSubmit}
      >
        <ButtonText>Log In</ButtonText>
      </Button>

      <HStack className="items-center">
        <Divider className="w-full" />
        <Text className="font-semibold mx-2">Or</Text>
        <Divider className="w-full" />
      </HStack>

      <VStack>
        <Box className="p-6 border border-outline-200 rounded-full">
          <HStack>
            <AntDesign name="google" size={24} color="black" />
            <Text>Continue with Google</Text>
          </HStack>
        </Box>
        <Box className="p-6 border border-outline-200 rounded-full">
          <HStack>
            <AntDesign name="apple1" size={24} color="black" />
            <Text>Continue with Apple</Text>
          </HStack>
        </Box>
      </VStack>
    </VStack>
    // <Text>test</Text>
  );
};

export default LogInForm;
