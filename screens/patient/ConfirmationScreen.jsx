// screens/patient/ConfirmationScreen.js
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import CustomButton from "../../components/forms/CustomButton";
// import { FaThumbsUp } from "react-icons/fa";

const ConfirmationScreen = ({ route, navigation }) => {
  let { doctor, date, time } = route.params || {};
  if (!doctor) {
    doctor = {
      id: "1",
      name: "Dr. John Doe",
      specialty: "Cardiologist",
      rating: 4.5,
      upvotes: 120,
      experience: 10,
      patientStories: 50,
      nextAvailable: "Tomorrow",
      isFavorite: true,
    };
    date = date || "2025-03-10";
    time = time || "10:00 AM";
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <FaThumbsUp size={80} color="#0474ed" /> */}

      <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 20 }}>
        Booking Confirmed!
      </Text>
      <Text style={{ fontSize: 16, marginTop: 10, textAlign: "center" }}>
        Your appointment with Dr. {doctor.name} has been confirmed for {date} at{" "}
        {time}.
      </Text>

      <CustomButton
        title="Done"
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "home",
                state: {
                  routes: [{ name: "Appointments" }],
                },
              },
            ],
          });
        }}
        style={{ marginTop: 30 }}
      />
    </View>
  );
};

export default ConfirmationScreen;
