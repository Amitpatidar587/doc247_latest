import React, { forwardRef, useImperativeHandle } from "react";
import { Alert, Platform } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const ImagePickerComponent = forwardRef(({ onImageSelected }, ref) => {
  useImperativeHandle(ref, () => ({
    openPicker: showImagePickerOptions,
  }));

  const pickImage = async (fromCamera) => {
    try {
      const options = {
        mediaType: "photo",
        includeBase64: false,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      };

      const response = fromCamera
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (response.didCancel) {
        console.log("User cancelled image picker");
        return;
      }

      if (response.errorCode) {
        console.error("Image Picker Error:", response.errorMessage);
        Alert.alert("Error", response.errorMessage);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;

        if (onImageSelected) {
          onImageSelected(imageUri);
        } else {
          console.warn("onImageSelected callback not defined");
        }
      } else {
        console.warn("No image selected");
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => pickImage(true),
        },
        {
          text: "Choose from Gallery",
          onPress: () => pickImage(false),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return null;
});

export default ImagePickerComponent;
