import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import PatientCard from "./PatientCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientDetails } from "../../../redux/slices/patient/patientSlice.js";
// import TabNavigation from "./TabNavigation";
// import PrescriptionCard from './PrescriptionCard';
// import PrescriptionScreen from "./PatientProfileDetails";

const aboutPatient = {
  id: "#4A001",
  name: "Rio Jonner",
  image:
    "https://doccure.dreamstechnologies.com/html/template/assets/img/doctors-dashboard/profile-01.jpg",
  age: "19",
  gender: "Male",
  bloodGroup: "B +ve",
  lastBooking: "24 Apr,2025",
};

const prescriptionData = {
  prescriptionDate: "21 Mar 2024",
  prescriptionId: "#PR-123",
  issuedDate: "21 Mar 2024",
  doctorDetails: {
    name: "Edalin Hendry",
    address: "806 Twin Willow Lane, Newyork, USA",
  },
  patientDetails: {
    name: "Adrian Marshall",
    address: "299 Star Trek Drive, Florida, 32405, USA",
  },
  prescriptionDetails: [
    {
      medicineName: "Ecosprin 75MG [Asprin 75 MG Oral Tab]",
      dosage: "75 mg",
      frequency: "1-0-0-1",
      duration: "1 month",
      timings: "Before Meal",
    },
    {
      medicineName: "Alexer 90MG Tab",
      dosage: "90 mg",
      frequency: "1-0-0-1",
      duration: "1 month",
      timings: "Before Meal",
    },
    {
      medicineName: "Ramistar XL2.5",
      dosage: "60 mg",
      frequency: "1-0-0-0",
      duration: "1 month",
      timings: "After Meal",
    },
    {
      medicineName: "Metscore",
      dosage: "90 mg",
      frequency: "1-0-0-1",
      duration: "1 month",
      timings: "After Meal",
    },
  ],
  otherInformation:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed dictum ligula, cursus blandit risus. Maecenas eget metus non tellus dignissim aliquam ut a ex. Maecenas sed vehicula dui, ac suscipit lacus. Sed finibus leo vitae lorem interdum, eu scelerisque tellus fermentum. Curabitur sit amet lacinia lorem. Nullam finibus pellentesque libero.",
  followUp: "Follow up after 3 months, Have to come on an empty stomach",
  doctorSignature: {
    name: "Dr. Edalin Hendry",
    department: "Dept of Cardiology",
  },
};

const PatientProfileDetails = ({ route }) => {
  const dispatch = useDispatch();

  const { userId } = route.params;
  const { patient } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatientDetails({ id: userId }));
  }, [dispatch, userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        {patient ? (
          <PatientCard patient={patient} />
        ) : (
          <ActivityIndicator size={"large"} color={"#000"} />
        )}
      </View>
      <View style={styles.section}>{/* <TabNavigation /> */}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 10,
  },
});

export default PatientProfileDetails;
