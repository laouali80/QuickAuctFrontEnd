import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import SubmitButton from "@/common_components/SubmitButton";
import { COLORS } from "@/constants/COLORS";
import { AntDesign } from "@expo/vector-icons";
import SelectDrop from "@/common_components/SelectDrop";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
// import PaymentMethod from "@/screens/Auctions/components/PaymentMethod";
import UploadPictModel from "./components/UploadPictModel";
import * as ImagePicker from "expo-image-picker";
import PaymentMethodSelector from "@/screens/Auctions/components/PaymentMethod";

const CreateAuctionFormScreen = ({ navigation }) => {
  const uploadSheetRef = useRef();
  const [state, setState] = useState({
    image: null,
    title: "",
    description: "",
    category: "",
    price: "",
    increase_amount: "",
    duration: "",
    type: "",
    delivery: "",
    payment: "",
  });
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
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

  useEffect(() => {
    console.log("states: ", state);
    validateForm();
  }, [state]); // Run validation whenever state changes

  const handleSelectDuration = (value) => {
    setSelectedDuration(value);
  };

  const handleSelectCategory = (category) => {
    setState((prevState) => ({ ...prevState, category })); // Merge updates
  };

  const handleSelectType = (type) => {
    setState((prevState) => ({ ...prevState, type })); // Merge updates
  };

  const handleSelectDelivery = (delivery) => {
    setState((prevState) => ({ ...prevState, delivery })); // Merge updates
  };

  const handleSelectIncreaseAmount = (increase_amount) => {
    setState((prevState) => ({ ...prevState, increase_amount })); // Merge updates
  };

  const handleChange = (text, fieldIndex) => {
    console.log(text, fieldIndex);
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

  const uploadImage = async (mode = "camera") => {
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
        setState((prevState) => ({ ...prevState, image: file })); // Merge update
        setImageUri(file.uri);
        // Dispatch the action correctly
        // dispatch(uploadThumbnail(file));
      }
      uploadSheetRef.current?.close();

      // setShowUploadModal(false);
    } catch (error) {
      console.log("Error uploading image: " + error.message);
    }
  };

  // validation
  const validateForm = () => {
    if (
      imageUri &&
      state.title.length >= 2 &&
      state.description.length >= 2 &&
      +state.price >= 0 &&
      state.price.length >= 2 &&
      // state.duration &&
      state.type &&
      state.delivery
      // state.payment
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleUpdTitle = (title) => {
    const cleanedTitle = title.replace(/\s+/g, " ").trim();
    setState((prevState) => ({ ...prevState, title: cleanedTitle })); // Merge updates
  };

  const handleUpdDescrip = (description) => {
    const cleanedDescription = description.replace(/\s+/g, " ").trim();
    setState((prevState) => ({
      ...prevState,
      description: cleanedDescription,
    })); // Merge updates
  };

  const handleUpdPrice = (price) => {
    setState((prevState) => ({ ...prevState, price })); // Merge updates
  };

  return (
    <ScrollView style={{ flex: 1, marginVertical: 20, marginHorizontal: 20 }}>
      <VStack space="md" className="flex-1">
        {/* Auction Images Section */}
        <VStack space="md">
          <Text className="text-xl font-semibold ">Add Images</Text>
          <HStack space="sm">
            {/* Placeholder or Uploaded Image */}
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Image 1</Text>
              </View>
            )}

            {/* Add Image Button */}
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => {
                uploadSheetRef.current?.open();
                // setShowUploadModal(true);
              }}
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
            value={state.title}
            onChangeText={handleUpdTitle}
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
              value={state.description}
              onChangeText={handleUpdDescrip}
            />
          </Textarea>

          {/* Category */}
          <SelectDrop
            placeholder="Category"
            selectItems={[
              { key: "Electronics", value: "electronics" },
              { key: "Furniture", value: "furniture" },
            ]}
            handleSelect={handleSelectCategory}
          />
        </VStack>

        {/* Auction Price, Jump Bid, Length, Type, Delivery Type */}
        <View
          className="flex flex-col py-4 gap-y-5"
          style={{
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
              value={state.price}
              onChangeText={handleUpdPrice}
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
              handleSelect={handleSelectIncreaseAmount}
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
              handleSelect={handleSelectDuration}
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
              handleSelect={handleSelectType}
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
              handleSelect={handleSelectDelivery}
            />
          </View>
        </View>

        {/* Payment Methods Section */}
        <PaymentMethodSelector allowMultiple={true} />

        <SubmitButton
          text="Post Auction"
          isDisabled={!isFormValid}
          handleSubmit={{}}
        />
      </VStack>
      {/* {showUploadModal && ( */}
      <UploadPictModel
        ref={uploadSheetRef}
        onCameraPress={() => uploadImage("camera")}
        onGalleryPress={() => uploadImage("gallery")}
      />
      {/* )} */}
    </ScrollView>
  );
};

export default CreateAuctionFormScreen;

const styles = StyleSheet.create({
  imagePlaceholder: {
    width: 130,
    height: 100,
    backgroundColor: "#e1e1e1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: 130,
    height: 100,
    borderRadius: 12,
  },
  placeholderText: {
    color: "#888",
  },
  addImageButton: {
    width: 130,
    height: 100,
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
});
