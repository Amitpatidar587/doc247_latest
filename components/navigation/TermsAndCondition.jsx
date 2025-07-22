import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Terms and Conditions - DOC247</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Effective Date:</Text> [Insert Date]{"\n"}
        <Text style={styles.bold}>Last Updated:</Text> [Insert Date]
      </Text>

      <Text style={styles.text}>
        Welcome to <Text style={styles.bold}>DOC247</Text> (“DOC247”, “we”,
        “us”, or “our”). DOC247 is revolutionizing healthcare by enabling users
        to find licensed doctors, book instant appointments (in-person or
        virtual), attend consultations, and make informed health decisions.
        These Terms and Conditions (“Terms”) govern your access to and use of
        our website, mobile application, and all related services (collectively,
        the “Platform”).
      </Text>
      <Text style={styles.text}>
        By accessing or using DOC247, you agree to these Terms. If you do not
        accept these Terms in their entirety, do not use the Platform.
      </Text>

      {/* 1. Definitions */}
      <Text style={styles.subheading}>1. Definitions</Text>
      {[
        "User: Any individual who accesses or uses the DOC247 Platform, whether as a patient, visitor, or registered member.",
        "Healthcare Provider: A licensed doctor or medical professional listed on or affiliated with the DOC247 Platform.",
        "Platform: All products, services, software, mobile applications, websites, and content offered by DOC247.",
      ].map((item, index) => (
        <Text key={index} style={styles.bulletPoint}>
          • {item}
        </Text>
      ))}

      {/* 2. Eligibility */}
      <Text style={styles.subheading}>
        2. Eligibility and Account Registration
      </Text>
      <Text style={styles.text}>To use the Platform, you must:</Text>
      {[
        "Be at least 18 years old or the age of majority in your province or territory;",
        "Have the legal capacity to enter into binding contracts;",
        "Provide accurate and truthful personal information;",
        "Maintain the confidentiality of your login credentials and notify us immediately of any unauthorized access.",
      ].map((item, index) => (
        <Text key={index} style={styles.bulletPoint}>
          • {item}
        </Text>
      ))}
      <Text style={styles.text}>
        We reserve the right to deny or terminate access to any user at our
        discretion.
      </Text>

      {/* Repeat pattern for all other sections */}
      {/* Use subheading for titles and bulletPoint or text for content */}

      <Text style={styles.subheading}>3. Services Provided</Text>
      {[
        "Search and compare providers;",
        "Book appointments (virtual/in-person);",
        "Access appointment history;",
        "View health education content.",
      ].map((item, index) => (
        <Text key={index} style={styles.bulletPoint}>
          • {item}
        </Text>
      ))}
      <Text style={styles.text}>
        DOC247 <Text style={styles.bold}>does not provide medical advice.</Text>{" "}
        All medical diagnoses, treatment plans, and prescriptions are the
        responsibility of the healthcare providers.
      </Text>

      {/* You can continue this pattern up to section 16 as needed */}

      <Text style={styles.subheading}>16. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions or concerns about these Terms, please contact:
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>DOC247 Support Team</Text>
        {"\n"}
        Email: [Insert Email Address]{"\n"}
        Phone: [Insert Phone Number]{"\n"}
        Mailing Address: [Insert Full Address], Canada
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  bulletPoint: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default TermsAndConditions;
