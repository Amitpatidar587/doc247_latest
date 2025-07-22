import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import doctorImage from "../../../assets/doctor.jpg"; // Import the doctor image

const DoctorProfile = ({ route, navigation }) => {
  const { colors } = useTheme();
  // Mock data for the selected doctor
  const doctor = {
    id: 1,
    name: "Dr. Amit Gupta",
    specialty: "Dentist, Orthodontist",
    experience: "22 years (15 years as specialist)",
    location: "Indore",
    rating: 5.0,
    fee: "₹300",
    availability: "Mon-Sat, 01:00 PM - 08:00 PM",
    bio: "Dr. Amit Gupta is an Orthodontist and Aesthetic dentist, he believes that only quality work leads to a great clinical practice.",
    qualifications: "BDS, MDS - Orthodontics",
    clinic: "Gupta Dental Specialty & Orthodontic Centre",
    address:
      "211, 1st Floor, Vikaram Tower, Landmark: Above Sony Showroom, Indore",
    services: [
      "Orthognathic Surgery",
      "Invisible/Clear Braces",
      "Cosmetic Veneers/Bonding",
      "Crowns and Bridges Fixing",
      "Tooth Extraction",
    ],
    reviews: [
      {
        id: 1,
        name: "Anavi",
        feedback: "Friendly nature of doctor",
        date: "29 days ago",
      },
      {
        id: 2,
        name: "User",
        feedback: "Dr. Amit and his staff were friendly and professional.",
        date: "a month ago",
      },
      {
        id: 3,
        name: "Ayushi Jain",
        feedback:
          "He is very soft spoken, positive, humble and ********* **************",
        date: "2 months ago",
      },
    ],
    education: [
      {
        degree: "BDS",
        institution: "Manipal College of Dental Sciences, Mangalore",
        year: "2003",
      },
      {
        degree: "MDS - Orthodontics",
        institution: "BHARATI VIDYAPEETH'S DENTAL COLLEGE & HOSPITAL PUNE",
        year: "2007",
      },
    ],
    awards: ["Fellow of Academy of General Education - 2003"],
    memberships: [
      "Indian Orthodontic Society",
      "Indian Dental Association",
      "Asia Pacific Orthodontic Society (APOS)",
      "Dental Council of India",
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={doctorImage} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          <Text style={styles.doctorDetails}>{doctor.qualifications}</Text>
          <View style={styles.detailsRow}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.doctorDetails}>Rating: {doctor.rating}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Icon name="map-marker" size={16} color="#6c757d" />
            <Text style={styles.doctorDetails}>{doctor.location}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Icon name="calendar" size={16} color="#6c757d" />
            <Text style={styles.doctorDetails}>
              Availability: {doctor.availability}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Icon name="currency-usd" size={16} color="#6c757d" />
            <Text style={styles.doctorDetails}>Fee: {doctor.fee}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bioSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{doctor.bio}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {doctor.education.map((edu, index) => (
          <Text key={index} style={styles.serviceText}>
            {edu.degree} - {edu.institution}, {edu.year}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <Text style={styles.serviceText}>{doctor.experience}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Awards and Recognitions</Text>
        {doctor.awards.map((award, index) => (
          <Text key={index} style={styles.serviceText}>
            {award}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {doctor.services.map((service, index) => (
          <Text key={index} style={styles.serviceText}>
            - {service}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Reviews</Text>
        {doctor.reviews.map((review) => (
          <View key={review.id} style={styles.review}>
            <Text style={styles.reviewName}>{review.name}</Text>
            <Text style={styles.reviewFeedback}>{review.feedback}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() =>
          navigation.navigate("BookAppointment", { doctorId: doctor.id })
        }
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    elevation: 3,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    marginBottom: 8,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  doctorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#343a40",
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 4,
  },
  doctorDetails: {
    fontSize: 14,
    color: "#adb5bd",
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  bioSection: {
    padding: 16,
    backgroundColor: "white",
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
  section: {
    padding: 16,
    backgroundColor: "white",
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#343a40",
  },
  bioText: {
    fontSize: 14,
    color: "#6c757d",
  },
  serviceText: {
    fontSize: 14,
    color: "#6c757d",
    marginVertical: 2,
  },
  review: {
    marginBottom: 8,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#343a40",
  },
  reviewFeedback: {
    fontSize: 14,
    color: "#6c757d",
  },
  reviewDate: {
    fontSize: 12,
    color: "#adb5bd",
  },
  bookButton: {
    margin: 16,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DoctorProfile;
