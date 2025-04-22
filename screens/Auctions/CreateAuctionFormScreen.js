import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import SubmitButton from "@/common_components/SubmitButton";
import { COLORS } from "@/constants/COLORS";
import { AntDesign } from "@expo/vector-icons";
import SelectDrop from "@/common_components/SelectDrop";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import PaymentMethod from "@/screens/Auctions/components/PaymentMethod";
import UploadPictModel from "./components/UploadPictModel";
import * as ImagePicker from "expo-image-picker";

const CreateAuctionFormScreen = ({ navigation }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [duration, setDuration] = useState([
    {
      type: "days",
      fields: ["days", "hours", "minutes", "seconds"],
      values: ["", "", "", ""],
    },
    {
      type: "hours",
      fields: ["hours", "minutes", "seconds"],
      values: ["", "", ""],
    },
    {
      type: "minutes",
      fields: ["minutes", "seconds"],
      values: ["", ""],
    },
  ]);

  const inputRefs = useRef([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create an Auction",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const handleSelect = (value) => {
    setSelectedDuration(value);
  };

  const handleChange = (text, fieldIndex) => {
    setDuration((prev) =>
      prev.map((item) =>
        item.type === selectedDuration
          ? {
              ...item,
              values: item.values.map((val, i) =>
                i === fieldIndex ? text : val
              ),
            }
          : item
      )
    );
  };

  const uploadImage = async (mode) => {
    let result = {};
    try {
      if (mode === "gallery") {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        // take picture
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        // console.log(result.assets[0].uri);
        const file = result.assets[0];
        // Dispatch the action correctly
        // dispatch(uploadThumbnail(file));
      }
      // setShowUploadModal(false);
    } catch (error) {
      console.log("Error uploading image: " + error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, marginVertical: 20, marginHorizontal: 20 }}>
      <VStack space="md" className="flex-1">
        {/* Auction Images Section */}
        <VStack space="md">
          <Text className="text-xl font-semibold ">Add Images</Text>
          <HStack space="sm">
            {/* Placeholder for uploaded images */}
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Image 1</Text>
            </View>

            {/* Add Image Button */}
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => setShowUploadModal(true)}
            >
              <AntDesign name="plus" size={35} color="white" />
            </TouchableOpacity>
          </HStack>
        </VStack>

        {/* Auction Title, Description and Category */}
        <VStack space="sm">
          {/* Title */}
          <TextInput
            placeholder="Product Title"
            style={{
              borderColor: COLORS.silverIcon,
              color: COLORS.primary,
              borderWidth: 1,
              fontWeight: "bold",
              borderRadius: 4,
              height: 35,
              paddingLeft: 10,
              width: "100%",
            }}
          />
          {/* Description */}
          <Textarea
            size="md"
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
            className="w-full"
            style={{
              borderColor: COLORS.silverIcon,
              borderWidth: 1,
            }}
          >
            <TextareaInput
              style={{ color: "black" }}
              placeholder="Your text goes here..."
            />
          </Textarea>

          {/* Category */}
          <SelectDrop
            placeholder="Category"
            selectItems={[
              { key: "Electronics", value: "electronics" },
              { key: "Furniture", value: "furniture" },
            ]}
          />
        </VStack>

        {/* Auction Price, Jump Bid, Length, Type, Delivery Type */}
        <View
          className="flex flex-col py-4 gap-y-5"
          style={{
            // borderWidth: 4,
            // borderColor: "blue",
            marginVertical: 9,
          }}
        >
          {/* Starting Price */}
          <View className="gap-y-2">
            <Text className="text-xl font-semibold ">Starting Price</Text>
            <TextInput
              placeholder="Starting Price"
              keyboardType="numeric"
              style={{
                borderColor: COLORS.silverIcon,
                color: "black",
                borderWidth: 1,
                // fontWeight: "bold",
                borderRadius: 4,
                height: 35,
                paddingLeft: 10,
              }}
            />
          </View>

          {/* Increase Bid */}
          <View className="gap-y-2">
            <Text className="text-xl font-semibold ">
              Increase Amount {"("}Optional{")"}
            </Text>
            <SelectDrop
              placeholder={"Type"}
              selectItems={[
                { key: "100", value: "100" },
                { key: "500", value: "500" },
                { key: "1k", value: "1000" },
                { key: "5k", value: "5000" },
                { key: "10k", value: "10000" },
              ]}
            />
          </View>

          {/* Auction Length */}
          <View className="gap-y-2">
            <Text className="text-xl font-semibold ">Auction Length</Text>
            <SelectDrop
              placeholder={"Duration"}
              selectItems={[
                { key: "Days", value: "days" },
                { key: "Hours", value: "hours" },
                { key: "Minutes", value: "minutes" },
              ]}
              handleSelect={handleSelect}
            />
            {selectedDuration && (
              <HStack space="xl" className="mt-2 py-4 justify-center">
                {duration
                  .find((item) => item.type === selectedDuration)
                  ?.values.map((digit, index) => (
                    <View
                      key={index}
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text className="mb-2">
                        {
                          duration.find(
                            (item) => item.type === selectedDuration
                          )?.fields[index]
                        }
                      </Text>

                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        className="rounded-lg font-semibold text-center"
                        style={{
                          borderWidth: 1,
                          borderColor: COLORS.silverIcon,
                          color: "black",
                          borderRadius: 5,
                          width: 50,
                          height: 40,
                          textAlign: "center",
                        }}
                        keyboardType="numeric"
                        maxLength={2}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        autoFocus={index === 0}
                      />
                    </View>
                  ))}
              </HStack>
            )}
          </View>

          {/* Auction Type */}
          <View className="gap-y-2">
            <Text className="text-xl font-semibold ">Product Type</Text>
            <SelectDrop
              placeholder={"Type"}
              selectItems={[
                { key: "Used", value: "used" },
                { key: "New", value: "new" },
              ]}
            />
          </View>

          {/* Delivery Type */}
          <View className="gap-y-2">
            <Text className="text-xl font-semibold">Delivery Type</Text>
            <SelectDrop
              placeholder={"Delivery"}
              selectItems={[
                { key: "Pickup", value: "pickup" },
                { key: "Delivery", value: "delivery" },
              ]}
            />
          </View>
        </View>

        {/* Payment Methods Section */}
        <VStack space={3}>
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
            Payment Methods
          </Text>

          <View style={styles.paymentMethods}>
            {/* First Row */}
            <View style={styles.paymentRow}>
              <PaymentMethod
                icon={require("../../assets/icons/nairaNote.svg")}
                label="Cash"
              />
              <PaymentMethod
                icon={require("../../assets/icons/BankTransfer.svg")}
                label="Bank Transfer"
              />
              <PaymentMethod
                icon={require("../../assets/icons/Paypal.svg")}
                label="PayPal"
              />
            </View>

            {/* Second Row */}
            {/* <HStack space={3} style={styles.paymentRow}>
              <PaymentMethod
                icon={require("../../assets/icons/DebitCard.svg")}
                label="Debit Card"
              />
              <PaymentMethod
                icon={require("../../assets/icons/Apple.svg")}
                label="Apple Pay"
              />
              <PaymentMethod label="Others" />
            </HStack> */}
          </View>
        </VStack>

        <SubmitButton text="Post Auction" isDisabled={true} handleSubmit={{}} />
      </VStack>
      {showUploadModal && (
        <UploadPictModel
          show={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onCameraPress={() => uploadImage()}
          onGalleryPress={() => uploadImage("gallery")}
        />
      )}
    </ScrollView>
  );
};

export default CreateAuctionFormScreen;

const styles = StyleSheet.create({
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#e1e1e1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  paymentMethods: {
    marginTop: 8,
  },
  paymentRow: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
