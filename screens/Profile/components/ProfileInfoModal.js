import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  getMessage,
  getStatus,
  getTokens,
  getUserInfo,
  updateUser,
} from "@/state/reducers/userSlice";
import SubmitButton from "@/common_components/SubmitButton";
import { showToast } from "@/animation/CustomToast/ToastManager";
import { useDebounce } from "@/hooks/useDebouce";

const ProfileInfoModal = ({ visible, onCancel }) => {
  const user = useSelector(getUserInfo);
  const [userInfo, setUserInfo] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    address: user.address,
    username: user.username,
    phone_number: user.phone_number,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tokens = useSelector(getTokens);
  const dispatch = useDispatch(); // Get dispatch function
  const updMssg = useSelector(getMessage);
  const updStatus = useSelector(getStatus);

  const validateForm = () => {
    const { first_name, last_name, username, address, phone_number } = userInfo;

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'. -]{2,}$/; // Handles most real names

    const isFirstName = nameRegex.test(first_name.trim());
    const isLastName = nameRegex.test(last_name.trim());

    const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/; // Letters, numbers, dot, underscore, dash (3+ chars)
    const isUsername = usernameRegex.test(username.trim());

    const isAddress = address.trim().length >= 5; // Most real addresses need at least 5 chars

    // Valid Nigerian prefixes (MTN, Airtel, Glo, 9mobile, etc.)
    const nigeriaPhoneRegex =
      /^(?:\+234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|910|911|912|913|914|915|916|917|918|919|920|921|922|923|924|925|926|927|928|929)\d{7}$/;

    const isPhoneNumber = nigeriaPhoneRegex.test(phone_number.trim());

    const valid =
      isFirstName && isLastName && isUsername && isAddress && isPhoneNumber;

    setIsFormValid(valid);
  };

  useDebounce(validateForm, 300, [userInfo]);

  const handleSumbit = async () => {
    if (!isFormValid) {
      Alert.alert("Invalid form", "Please fill all required fields properly.");
      return;
    }

    try {
      setIsSubmitting(true);
      Platform.OS === "web"
        ? dispatch(updateUser({ ...userInfo, tokens: tokens }))
        : dispatch(updateUser(userInfo));
      // console.log("state", userInfo);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!updMssg || !updStatus) return;
    if (updMssg) {
      showToast({
        text: updMssg,
        duration: 2000,
        type: updStatus,
      });
    }
    if (updStatus === "success") {
      setTimeout(() => {
        onCancel();
      }, 2000); // wait for toast to show before navigating
    }

    dispatch(clearMessage());
  }, [updMssg, updStatus]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
          <Text className="text-lg font-semibold mb-4">
            Edit Profile Information
          </Text>

          {/* First Name */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">First Name</Text>
            <TextInput
              value={userInfo.first_name || ""}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, first_name: text })
              }
              // keyboardType="email-address"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500"
            />
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Last Name</Text>
            <TextInput
              value={userInfo.last_name || ""}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, last_name: text })
              }
              keyboardType="email-address"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500"
            />
          </View>

          {/* username */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Username</Text>
            <TextInput
              value={userInfo.username || ""}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, username: text })
              }
              keyboardType="email-address"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500"
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Phone</Text>
            <TextInput
              value={userInfo.phone_number || ""}
              onChangeText={(text) => {
                const formatted = text.replace(/\D/g, "").slice(0, 11);
                setUserInfo({ ...userInfo, phone_number: formatted });
              }}
              maxLength={11}
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500"
            />
          </View>

          {/* Address */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Shipping Address</Text>
            <TextInput
              value={userInfo.address || ""}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, address: text })
              }
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="border border-gray-300 rounded-lg px-3 py-2 h-24 focus:border-green-500"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-end space-x-3 mt-6">
            <TouchableOpacity
              onPress={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <SubmitButton
              textColor="white"
              text="Update"
              className="px-4 py-2"
              isDisabled={!isFormValid || isSubmitting}
              handleSubmit={handleSumbit}
              showSpinner={updStatus === "pending" ? true : false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileInfoModal;

const styles = StyleSheet.create({});
