import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Terms and Conditions - DOC247</Text>
      {/* <Text style={styles.paragraph}>
        <Text style={styles.bold}>Effective Date:</Text> [Insert Date]{'\n'}
        <Text style={styles.bold}>Last Updated:</Text> [Insert Date]
      </Text> */}

      <Text style={styles.paragraph}>
        Welcome to <Text style={styles.bold}>DOC247</Text> (“DOC247”, “we”,
        “us”, or “our”). DOC247 is revolutionizing healthcare by enabling users
        to find licensed doctors, book instant appointments (in-person or
        virtual), attend consultations, and make informed health decisions.
        These Terms and Conditions (“Terms”) govern your access to and use of
        our website, mobile application, and all related services (collectively,
        the “Platform”).
      </Text>
      <Text style={styles.paragraph}>
        By accessing or using DOC247, you agree to these Terms. If you do not
        accept these Terms in their entirety, do not use the Platform.
      </Text>

      {/* Section 1 */}
      <Text style={styles.subheading}>1. Definitions</Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>User:</Text> Any individual who accesses or
        uses the DOC247 Platform.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Healthcare Provider:</Text> A licensed doctor
        or medical professional.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Platform:</Text> All products, services,
        software, and content offered by DOC247.
      </Text>

      {/* Section 2 */}
      <Text style={styles.subheading}>
        2. Eligibility and Account Registration
      </Text>
      <Text style={styles.listItem}>
        • Be at least 18 years old or the age of majority in your province or
        territory.
      </Text>
      <Text style={styles.listItem}>
        • Have the legal capacity to enter into binding contracts.
      </Text>
      <Text style={styles.listItem}>
        • Provide accurate and truthful personal information.
      </Text>
      <Text style={styles.listItem}>
        • Maintain confidentiality of login credentials.
      </Text>
      <Text style={styles.paragraph}>
        We reserve the right to deny or terminate access to any user at our
        discretion.
      </Text>

      {/* Section 3 */}
      <Text style={styles.subheading}>3. Services Provided</Text>
      <Text style={styles.listItem}>• Search and compare providers</Text>
      <Text style={styles.listItem}>
        • Book appointments (virtual/in-person)
      </Text>
      <Text style={styles.listItem}>• Access appointment history</Text>
      <Text style={styles.listItem}>• View health education content</Text>
      <Text style={styles.paragraph}>
        DOC247 <Text style={styles.bold}>does not provide medical advice.</Text>{" "}
        Responsibility lies with healthcare providers.
      </Text>

      {/* Repeat similar blocks for each remaining section */}
      {/* Sections 4 to 16... */}
      <Text style={styles.subheading}>4. Use of the Platform</Text>
      <Text style={styles.listItem}>
        • Impersonation or misrepresentation is prohibited.
      </Text>
      <Text style={styles.listItem}>
        • Do not interfere with platform operation or security.
      </Text>
      <Text style={styles.listItem}>
        • Do not post false, obscene, or unlawful content.
      </Text>
      <Text style={styles.listItem}>
        • No unauthorized data collection or access.
      </Text>

      <Text style={styles.subheading}>
        5. Healthcare Provider Listings and Appointments
      </Text>
      <Text style={styles.listItem}>• Listings do not imply endorsement.</Text>
      <Text style={styles.listItem}>
        • Verify provider credentials independently.
      </Text>
      <Text style={styles.listItem}>
        • DOC247 is not liable for cancellations or quality of care.
      </Text>
      <Text style={styles.listItem}>
        • Missed appointments may incur provider-determined fees.
      </Text>

      <Text style={styles.subheading}>6. Payment and Fees</Text>
      <Text style={styles.listItem}>• Providers set their own fees.</Text>
      <Text style={styles.listItem}>
        • DOC247 may charge service fees with prior notice.
      </Text>
      <Text style={styles.listItem}>
        • Payments go through secure third-party processors.
      </Text>
      <Text style={styles.listItem}>
        • Users are responsible for all service-related fees.
      </Text>

      <Text style={styles.subheading}>7. Privacy and Data Protection</Text>
      <Text style={styles.paragraph}>
        Your use of the Platform is subject to our Privacy Policy which complies
        with Canadian privacy laws including{" "}
        <Text style={styles.bold}>PIPEDA</Text>,{" "}
        <Text style={styles.bold}>PHIPA</Text>, and{" "}
        <Text style={styles.bold}>HIA</Text>. Internet data transmission is at
        your own risk.
      </Text>

      <Text style={styles.subheading}>8. Intellectual Property</Text>
      <Text style={styles.paragraph}>
        All content is owned by DOC247 or its licensors. You may not copy,
        distribute, or create derivatives without consent.
      </Text>

      <Text style={styles.subheading}>9. User-Generated Content</Text>
      <Text style={styles.listItem}>
        • You grant DOC247 a license to use submitted content.
      </Text>
      <Text style={styles.listItem}>
        • You must have rights to share the content.
      </Text>
      <Text style={styles.listItem}>
        • No false, harmful, or offensive content.
      </Text>

      <Text style={styles.subheading}>10. Third-Party Services and Links</Text>
      <Text style={styles.paragraph}>
        DOC247 is not responsible for third-party services. Use is at your own
        risk.
      </Text>

      <Text style={styles.subheading}>11. Limitation of Liability</Text>
      <Text style={styles.listItem}>
        • No liability for indirect or consequential damages.
      </Text>
      <Text style={styles.listItem}>
        • No responsibility for medical outcomes.
      </Text>
      <Text style={styles.listItem}>
        • No guarantees of uninterrupted service.
      </Text>

      <Text style={styles.subheading}>12. Disclaimer</Text>
      <Text style={styles.paragraph}>
        DOC247 is not a medical provider. All medical responsibility lies with
        licensed professionals.
      </Text>

      <Text style={styles.subheading}>13. Termination</Text>
      <Text style={styles.paragraph}>
        DOC247 may terminate access at any time for violation. Upon termination,
        rights under these Terms cease.
      </Text>

      <Text style={styles.subheading}>14. Changes to These Terms</Text>
      <Text style={styles.paragraph}>
        We may update these Terms at any time. Continued use constitutes
        acceptance.
      </Text>

      <Text style={styles.subheading}>
        15. Governing Law and Dispute Resolution
      </Text>
      <Text style={styles.paragraph}>
        Governed by the laws of{" "}
        <Text style={styles.bold}>Province of [Insert Province]</Text>.
        Jurisdiction lies with courts in [Insert City, Province].
      </Text>

      {/* <Text style={styles.subheading}>16. Contact Us</Text> */}
      {/* <Text style={styles.paragraph}>
        DOC247 Support Team{'\n'}
        Email: [Insert Email Address]{'\n'}
        Phone: [Insert Phone Number]{'\n'}
        Mailing Address: [Insert Full Address], Canada
      </Text> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    marginLeft: 12,
    marginBottom: 6,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default TermsAndConditions;
