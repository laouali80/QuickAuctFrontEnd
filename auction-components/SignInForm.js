import {
  FormControl,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { EyeIcon, EyeOffIcon, CheckIcon } from "@/components/ui/icon";
import React, { useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import {
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { HStack } from "@/components/ui/hstack";
import TermsConditionsModal from "./TermsConditionsModal";
import SubmitButton from "./share-components/SubmitButton";
import OrDivider from "./share-components/OrDivider";
import SocialsButton from "./share-components/SocialsButton";

const SignUpForm = () => {
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
  const [showTermsConditions, setShowTermsConditions] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <VStack className="px-8 py-4">
        <FormControl size="md" className="gap-y-4">
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Username", name: "username" },
            {
              label: "Email",
              name: "email",
              props: { keyboardType: "email-address" },
            },
            {
              label: "Phone Number",
              name: "phoneNumber",
              props: { keyboardType: "phone-pad" },
            },
          ].map(({ label, name, props }) => (
            <VStack space="xs" key={name}>
              <Text className="text-typography-500">{label}</Text>
              <Input className="min-w-[250px]">
                <InputField
                  type="text"
                  value={formData[name]}
                  onChangeText={(text) => handleChange(name, text)}
                  {...props}
                />
              </Input>
              {errors[name] && (
                <FormControlErrorText>{errors[name]}</FormControlErrorText>
              )}
            </VStack>
          ))}

          {/* Password Fields */}
          {[
            { label: "Password", name: "password", show: showPassword },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              show: showConfirmPassword,
            },
          ].map(({ label, name, show }) => (
            <VStack space="xs" key={name}>
              <FormControlLabel>
                <FormControlLabelText>{label}</FormControlLabelText>
              </FormControlLabel>
              <Input className="text-center">
                <InputField
                  type={show ? "text" : "password"}
                  value={formData[name]}
                  onChangeText={(text) => handleChange(name, text)}
                  autoCapitalize="none"
                  autoFocus={false}
                />
                <InputSlot
                  className="pr-3"
                  onPress={() => {
                    if (name === "password") {
                      setShowPassword((prev) => !prev);
                    } else {
                      setShowConfirmPassword((prev) => !prev);
                    }
                  }}
                >
                  <InputIcon as={show ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
              {errors[name] && (
                <FormControlErrorText>{errors[name]}</FormControlErrorText>
              )}
            </VStack>
          ))}

          {/* Terms Checkbox */}
          <HStack space="xs">
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
            </Checkbox>
            <Pressable onPress={() => setShowTermsConditions(true)}>
              <Text>
                I agree to{" "}
                <Text className="text-blue-600">terms and conditions</Text>
              </Text>
            </Pressable>
            {errors.termsAccepted && (
              <FormControlErrorText>
                {errors.termsAccepted}
              </FormControlErrorText>
            )}
          </HStack>
        </FormControl>

        {/* Submit Button */}
        <SubmitButton
          handleSubmit={handleSubmit}
          text="Sign Up"
          isDisabled={
            !formData.firstName ||
            !formData.lastName ||
            !formData.username ||
            !formData.email ||
            !formData.phoneNumber ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.termsAccepted
          }
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
    </Pressable>
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
