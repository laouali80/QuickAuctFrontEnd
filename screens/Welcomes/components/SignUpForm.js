import {
  FormControl,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { EyeIcon, EyeOffIcon, CheckIcon } from "@/components/ui/icon";
import React, { useEffect, useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { Pressable, Keyboard, Platform } from "react-native";
import { HStack } from "@/components/ui/hstack";
import TermsConditionsModal from "./TermsConditionsModal";
import SubmitButton from "@/common_components/SubmitButton";
import OrDivider from "@/common_components/OrDivider";
import SocialsButton from "./SocialsButton";
import api from "@/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  EmailVerification,
  getMessage,
  getStatus,
  SignUpUser,
} from "@/state/reducers/userSlice";
import { useNavigation } from "@react-navigation/native";
import { persistor } from "@/state/store";
import secure from "@/storage/secure";
import CustomInputField from "@/common_components/CustomInputField";
import { showToast } from "@/animation/CustomToast/ToastManager";

const SignUpForm = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    aggrement: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const dispatch = useDispatch(); // Get dispatch function

  const emailVerifMssg = useSelector(getMessage);
  const emailVerifStatus = useSelector(getStatus);

  useEffect(() => {
    if (!emailVerifMssg || !emailVerifStatus) return;
    if (emailVerifMssg) {
      showToast({
        text: emailVerifMssg,
        duration: 2000,
        type: emailVerifStatus,
      });
    }
    // console.log("email: ", emailVerifMssg, emailVerifStatus);
    if (emailVerifStatus === "success") {
      setTimeout(() => {
        navigation.navigate("OTP", formData);
      }, 2000); // wait for toast to show before navigating
    }

    dispatch(clearMessage());
  }, [emailVerifMssg, emailVerifStatus]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;

    if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!formData.aggrement) {
      setTermsError("You must accept the terms.");
      isValid = false;
    } else {
      setTermsError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // console.log("Form submitted:", formData);

      dispatch(
        EmailVerification({
          email: formData.email.toLowerCase(),
        })
      );
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
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
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
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
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

        {/* Terms Checkbox */}
        <HStack space="xs">
          <Checkbox
            size="md"
            isChecked={formData.aggrement}
            onChange={() => handleChange("aggrement", !formData.aggrement)}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
          <Pressable onPress={() => setShowTermsConditions(true)}>
            <Text style={{ color: "#262627", fontWeight: "bold" }}>
              I agree to{" "}
              <Text className="text-blue-600">terms and conditions</Text>
            </Text>
          </Pressable>
        </HStack>
      </FormControl>

      {/* Submit Button */}
      <SubmitButton
        handleSubmit={handleSubmit}
        text="Sign Up"
        isDisabled={
          !formData.email ||
          !formData.password ||
          !formData.aggrement ||
          emailVerifStatus === "pending"
        }
        textColor="white"
        showSpinner={emailVerifStatus === "pending" ? true : false}
      />

      {/* OR Divider */}
      <OrDivider />

      {/* Social Buttons */}
      <SocialsButton />

      {showTermsConditions && (
        <TermsConditionsModal
          show={showTermsConditions}
          onClose={() => setShowTermsConditions(false)}
        />
      )}
    </VStack>
  );
};

export default SignUpForm;

// const SignInForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     termsAccepted: false,
//   });

//   const [isInvalid, setIsInvalid] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = () => {
//     let newErrors = {};

//     if (!formData.firstName) newErrors.firstName = "First Name is required.";
//     if (!formData.lastName) newErrors.lastName = "Last Name is required.";
//     if (!formData.username) newErrors.username = "Username is required.";
//     if (!formData.email.includes("@"))
//       newErrors.email = "Invalid email address.";
//     if (formData.password.length < 6)
//       newErrors.password = "Password must be at least 6 characters.";
//     if (formData.confirmPassword !== formData.password)
//       newErrors.confirmPassword = "Passwords do not match.";
//     if (!formData.termsAccepted)
//       newErrors.termsAccepted = "You must accept the terms.";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       console.log("Form submitted:", formData);
//     }
//   };

//   return (
//     <VStack className="px-8 py-4">
//       <FormControl isInvalid={isInvalid} size="md" className="gap-y-4">
//         <VStack space="xs">
//           <Text className="text-typography-500">First Name</Text>
//           <Input className="min-w-[250px]">
//             <InputField
//               type="text"
//               value={formData.firstName}
//               onChangeText={(text) => handleChange("firstName", text)}
//             />
//           </Input>
//           {errors.firstName && (
//             <FormControlErrorText>{errors.firstName}</FormControlErrorText>
//           )}
//         </VStack>

//         <VStack space="xs">
//           <Text className="text-typography-500">Last Name</Text>
//           <Input className="min-w-[250px]">
//             <InputField
//               type="text"
//               value={formData.lastName}
//               onChangeText={(text) => handleChange("lastName", text)}
//             />
//           </Input>
//           {errors.lastName && (
//             <FormControlErrorText>{errors.lastName}</FormControlErrorText>
//           )}
//         </VStack>

//         <VStack space="xs">
//           <Text className="text-typography-500">Username</Text>
//           <Input className="min-w-[250px]">
//             <InputField
//               type="text"
//               value={formData.username}
//               onChangeText={(text) => handleChange("username", text)}
//             />
//           </Input>
//           {errors.username && (
//             <FormControlErrorText>{errors.username}</FormControlErrorText>
//           )}
//         </VStack>

//         <VStack space="xs">
//           <Text className="text-typography-500">Email</Text>
//           <Input className="min-w-[250px]">
//             <InputField
//               type="text"
//               value={formData.email}
//               onChangeText={(text) => handleChange("email", text)}
//             />
//           </Input>
//           {errors.email && (
//             <FormControlErrorText>{errors.email}</FormControlErrorText>
//           )}
//         </VStack>

//         <VStack space="xs">
//           <Text className="text-typography-500">Phone Number</Text>
//           <Input className="min-w-[250px]">
//             <InputField
//               type="text"
//               value={formData.phoneNumber}
//               onChangeText={(text) => handleChange("phoneNumber", text)}
//             />
//           </Input>
//           {errors.phoneNumber && (
//             <FormControlErrorText>{errors.phoneNumber}</FormControlErrorText>
//           )}
//         </VStack>

//         <VStack space="xs">
//           <FormControlLabel>
//             <FormControlLabelText>Password</FormControlLabelText>
//           </FormControlLabel>
//           <Input className="text-center">
//             <InputField
//               type={showPassword ? "text" : "password"}
//               value={formData.password}
//               onChangeText={(text) => handleChange("password", text)}
//             />
//             <InputSlot
//               className="pr-3"
//               onPress={() => setShowPassword(!showPassword)}
//             >
//               <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
//             </InputSlot>
//           </Input>
//           {errors.password && (
//             <FormControlErrorText>{errors.password}</FormControlErrorText>
//           )}
//         </VStack>

//         <VStack space="xs">
//           <FormControlLabel>
//             <FormControlLabelText>Confirm Password</FormControlLabelText>
//           </FormControlLabel>
//           <Input className="text-center">
//             <InputField
//               type={showConfirmPassword ? "text" : "password"}
//               value={formData.confirmPassword}
//               onChangeText={(text) => handleChange("confirmPassword", text)}
//             />
//             <InputSlot
//               className="pr-3"
//               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
//             </InputSlot>
//           </Input>
//           {errors.confirmPassword && (
//             <FormControlErrorText>
//               {errors.confirmPassword}
//             </FormControlErrorText>
//           )}
//         </VStack>
//         <VStack space="xs">
//           <Checkbox
//             size="md"
//             isChecked={formData.termsAccepted}
//             onChange={() =>
//               handleChange("termsAccepted", !formData.termsAccepted)
//             }
//           >
//             <CheckboxIndicator>
//               <CheckboxIcon as={CheckIcon} />
//             </CheckboxIndicator>
//             <CheckboxLabel>I agree to terms and conditions</CheckboxLabel>
//           </Checkbox>
//           {errors.termsAccepted && (
//             <FormControlErrorText>{errors.termsAccepted}</FormControlErrorText>
//           )}
//         </VStack>
//       </FormControl>

//       <Button
//         className="w-full self-center mt-4 bg-[#259e47] rounded-lg"
//         size="sm"
//         onPress={handleSubmit}
//         isDisabled={
//           !formData.firstName ||
//           !formData.firstName ||
//           !formData.firstName ||
//           !formData.firstName ||
//           !formData.password ||
//           !formData.confirmPassword ||
//           !formData.termsAccepted
//         }
//       >
//         <ButtonText>Sign Up</ButtonText>
//       </Button>

//       {/* OR Divider */}
//       <HStack className="flex items-center my-4">
//         <Divider className="flex-1" />
//         <Text className="font-semibold mx-2">Or</Text>
//         <Divider className="flex-1" />
//       </HStack>

//       <VStack space="sm" className="mt-4">
//         <Pressable className="p-4 border border-outline-200 rounded-full flex-row items-center justify-center">
//           <AntDesign name="google" size={24} color="black" />
//           <Text className="ml-2">Continue with Google</Text>
//         </Pressable>
//         <Pressable className="p-4 border border-outline-200 rounded-full flex-row items-center justify-center">
//           <AntDesign name="apple1" size={24} color="black" />
//           <Text className="ml-2">Continue with Apple</Text>
//         </Pressable>
//       </VStack>
//     </VStack>
//   );
// };

// export default SignInForm;
