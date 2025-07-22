import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, ScrollView ,Button, TextInput, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { fetchDoctorProfile, updateDoctorProfile, updateProfileField } from "../../redux/slices/doctorSlice";
import { ImagePicker } from "expo-image-picker";
// import { addDays, format, isValid, parse, parseISO } from "date-fns";

const DoctorProfilePage = ({ doctorId }) => {   
 
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.doctor);
  const [apicall, setApicall] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
   dispatch(fetchDoctorProfile(doctorId));

   
  }, [doctorId,dispatch]);

 
  const handleInputChange = (field, value) => {
    dispatch(updateProfileField({ field, value }));

  };

  const handleImageUpload = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri);
      // Upload the image to your backend and update the profile
      // (using FormData and axios or fetch)
    }
  };

  const handleSave = async () => {
    dispatch(updateDoctorProfile({ doctorId, profileData: profile }));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!profile) {
    return <Text>Profile not found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      
        <View style={styles.section}>
          <Text style={styles.title}>Profile</Text>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image
              source={{ uri: profile.profile_image }}
              style={styles.image}
            />
          )}
          <Button title="Upload New" onPress={handleImageUpload} />
          <Button title="Remove" />
      </View>
      <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={profile.full_name}
            onChangeText={(text) => handleInputChange("full_name", text)}
          />
           <TextInput
            style={styles.input}
            placeholder="Email"
            value={profile.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
          {/* Add more TextInput fields for other profile details */}
          <Button title="Save" onPress={handleSave} />
        </View>
   
       
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    overflow: "scroll",
    marginBottom: 70,
  },
  subHeader: {
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
});

export default DoctorProfilePage;
