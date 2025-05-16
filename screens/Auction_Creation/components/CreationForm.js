import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import SubmitButton from "@/common_components/SubmitButton";
// import PaymentMethod from "@/screens/Auctions/components/PaymentMethod";
import * as ImagePicker from "expo-image-picker";
import PaymentMethodSelector from "@/screens/Auction_Creation/components/PaymentMethod";
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import CategorySelection from "./CategorySelection";
import StartingPrice from "./StartingPrice";
import BidIncreament from "./BidIncreament";
import AuctionDeliveryMode from "./AuctionDeliveryMode";
import AuctionLength from "./AuctionLength";
import AddImages from "./AddImages";
import { createAuction } from "@/state/reducers/auctionsSlice";
import ItemCondition from "./ItemCondition";
import UploadPictModel from "./UploadPictModel";
import { useDebounce } from "@/hooks/useDebouce";

const CreationForm = ({ navigation }) => {
  // State declarations
  const [state, setState] = useState({
    image: null,
    title: "",
    description: "",
    category: "",
    starting_price: "",
    bid_increment: "",
    end_time: [],
    item_condition: "",
    shipping_details: "",
    payment_methods: [],
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [imageUri, setImageUri] = useState(null);
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

  // Refs
  const uploadSheetRef = useRef();

  // Navigation setup
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: "Create an Auction",
  //     headerTitleAlign: "center",
  //   });
  // }, [navigation]);

  // Form validation

  const validateForm = () => {
    const {
      image,
      title,
      description,
      category,
      starting_price,
      bid_increment,
      end_time,
      item_condition,
      shipping_details,
      payment_methods,
    } = state;

    const isImageValid = image !== null;
    const isTitleValid = typeof title === "string" && title.trim().length >= 2;
    const isDescriptionValid =
      typeof description === "string" && description.trim().length >= 2;
    const isCategoryValid = !isNaN(category);
    const isStartingPriceValid =
      !isNaN(starting_price) &&
      starting_price >= 0 &&
      starting_price.toString().length >= 2;
    const isJumpBidValid = !isNaN(bid_increment) && bid_increment >= 0;
    const isDurationValid =
      Array.isArray(end_time) && end_time.some((d) => Number(d) > 0);
    const isItemConditionValid = item_condition !== "";
    const isDeliveryValid = shipping_details !== "";
    const isPaymentMethodsValid =
      Array.isArray(payment_methods) && payment_methods.length > 0;

    const valid =
      isImageValid &&
      isTitleValid &&
      isDescriptionValid &&
      isCategoryValid &&
      isStartingPriceValid &&
      isJumpBidValid &&
      isDurationValid &&
      isItemConditionValid &&
      isDeliveryValid &&
      isPaymentMethodsValid;

    setIsFormValid(valid);
  };

  useDebounce(validateForm, 300, [state]); // waits 300ms after last change

  // State update handlers
  const handleSelectCategory = (value) => {
    const category = parseInt(value);
    // Merge updates
    setState((prevState) => ({ ...prevState, category }));
  };

  const handleSelectItemCondition = (item_condition) => {
    // Merge updates
    setState((prevState) => ({ ...prevState, item_condition }));
  };

  const handleSelectDelivery = (shipping_details) => {
    // Merge updates
    setState((prevState) => ({ ...prevState, shipping_details }));
  };

  const handleSelectIncreaseAmount = (value) => {
    const bid_increment = parseInt(value);
    // Merge updates
    setState((prevState) => ({ ...prevState, bid_increment }));
  };

  const handleUpdTitle = (title) => {
    // Merge updates
    const cleanedTitle = title.replace(/\s+/g, " ").trim();
    setState((prevState) => ({ ...prevState, title: cleanedTitle }));
  };

  const handleUpdDescrip = (description) => {
    // Merge updates
    const cleanedDescription = description.replace(/\s+/g, " ").trim();
    setState((prevState) => ({
      ...prevState,
      description: cleanedDescription,
    }));
  };

  const handleUpdStartingPrice = (value) => {
    const starting_price = parseInt(value);
    // Merge updates
    setState((prevState) => ({ ...prevState, starting_price }));
  };

  const updateStateDuration = (fieldIndex, value) => {
    setState((prev) => {
      const durationItem = duration.find(
        (item) => item.type === selectedDuration
      );

      if (!durationItem) return prev;

      const updatedValues = durationItem.values.map((v, i) =>
        i === fieldIndex ? value : v
      );

      const sanitized = updatedValues.map((v) => {
        const num = parseInt(v);
        return isNaN(num) ? 0 : num;
      });

      return {
        ...prev,
        end_time: sanitized,
      };
    });
  };

  // Image handling
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
        const file = result.assets[0];
        setState((prevState) => ({ ...prevState, image: file }));
        setImageUri(file.uri);
      }
      uploadSheetRef.current?.close();
    } catch (error) {
      console.log("Error uploading image: " + error.message);
    }
  };

  const showUploadModal = () => {
    uploadSheetRef.current?.open();
  };

  // Form submission
  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Invalid form", "Please fill all required fields properly.");
      return;
    }

    setIsSubmitting(true);
    try {
      // console.log("Submitting auction data:", state);
      createAuction(state); //  Don't dispatch

      // Reset form after successful submission
      setState({
        image: null,
        title: "",
        description: "",
        category: "",
        starting_price: "",
        bid_increment: "",
        end_time: [],
        item_condition: "",
        shipping_details: "",
        payment_methods: "",
      });
      setImageUri(null);
      setIsFormValid(false);
      setIsSubmitting(false);
      setSelectedDuration(null);

      // Navigate back or show success message
      // navigation.goBack();
      // Alternatively show success alert:
      // Alert.alert("Success", "Your auction has been posted successfully!");
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, marginVertical: 20, marginHorizontal: 20 }}>
      <VStack space="md" className="flex-1">
        {/* Auction Images Section */}
        <AddImages imageUri={imageUri} showUploadModal={showUploadModal} />

        {/* Auction Title, Description and Category */}
        <VStack space="sm">
          {/* Title */}
          <TitleInput value={state.title} handleUpdTitle={handleUpdTitle} />

          {/* Description */}
          <DescriptionInput
            value={state.description}
            handleUpdDescrip={handleUpdDescrip}
          />

          {/* Category */}
          <CategorySelection handleSelectCategory={handleSelectCategory} />
        </VStack>

        {/* Auction Price, Jump Bid, Length, item_condition, Delivery Type */}
        <View
          className="flex flex-col py-4 gap-y-5"
          style={{
            marginVertical: 9,
          }}
        >
          {/* Starting Price */}
          <StartingPrice
            value={state.starting_price}
            handleUpdPrice={handleUpdStartingPrice}
          />

          {/* Increase Bid */}
          <BidIncreament
            handleSelectIncreaseAmount={handleSelectIncreaseAmount}
          />

          {/* Auction Length */}

          <AuctionLength
            updateStateDuration={updateStateDuration}
            duration={duration}
            setDuration={setDuration}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />

          {/* Auction Type */}
          <ItemCondition handleSelectCondition={handleSelectItemCondition} />

          {/* Delivery Type */}
          <AuctionDeliveryMode handleSelectDelivery={handleSelectDelivery} />
        </View>

        {/* Payment Methods Section */}
        <PaymentMethodSelector
          selectedMethods={state.payment_methods}
          setSelectedMethods={(method) =>
            setState((prevState) => ({ ...prevState, payment_methods: method }))
          }
        />

        <SubmitButton
          text={isSubmitting ? "Posting..." : "Post Auction"}
          isDisabled={!isFormValid || isSubmitting}
          handleSubmit={handleSubmit}
          showSpinner={isSubmitting}
        />
      </VStack>

      <UploadPictModel
        ref={uploadSheetRef}
        onCameraPress={() => uploadImage("camera")}
        onGalleryPress={() => uploadImage("gallery")}
      />
    </ScrollView>
  );
};

export default CreationForm;

const styles = StyleSheet.create({});
