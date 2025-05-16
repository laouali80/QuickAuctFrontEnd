// Image handling
import * as ImagePicker from "expo-image-picker";

export const uploadImage = async (mode = "camera") => {
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
