// Form submission
export const handleSubmit = async () => {
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
