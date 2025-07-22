import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

function PrivacyPolicy() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          Privacy Policy - DOC247
        </Text>
        {/* <Text style={styles.paragraph}>
          <Text style={styles.bold}>Effective Date:</Text> [Insert Date]
          {"\n"}
          <Text style={styles.bold}>Last Updated:</Text> [Insert Date]
        </Text> */}

        <Text style={styles.paragraph}>
          DOC247 (“DOC247,” “we,” “us,” or “our”) is committed to protecting the
          privacy and confidentiality of the personal and health information of
          our users. This Privacy Policy outlines how we collect, use, disclose,
          store, and protect your information when you access our website,
          mobile app, or any services we provide (collectively, the “Platform”).
        </Text>

        <Text style={styles.paragraph}>
          By using DOC247, you agree to the terms of this Privacy Policy. If you
          do not agree, please do not use our services.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>1. About DOC247</Text>
        <Text style={[styles.paragraph, styles.marginBottom]}>
          DOC247 is a Canadian healthcare technology platform that empowers
          users to:
        </Text>
        {[
          "Find and compare qualified healthcare providers;",
          "Book instant in-person or virtual appointments;",
          "Access consultations and health records;",
          "Make better, more informed healthcare decisions.",
        ].map((item, i) => (
          <Text key={i} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}
        <Text style={styles.paragraph}>
          We act as an intermediary and do not provide medical services
          directly. All healthcare is delivered by licensed professionals.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          2. Scope of this Policy
        </Text>
        <Text style={[styles.paragraph, styles.marginBottom]}>
          This policy applies to all personal information collected through
          DOC247 from individuals in Canada, and adheres to:
        </Text>
        {[
          "Personal Information Protection and Electronic Documents Act (PIPEDA)",
          "Provincial health privacy legislation (e.g., PHIPA in Ontario, HIA in Alberta, and Access to Information and Protection of Privacy Act (ATIPP) in other provinces)",
          "Applicable guidelines issued by the Office of the Privacy Commissioner of Canada.",
        ].map((item, i) => (
          <Text key={i} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          3. What Personal Information We Collect
        </Text>
        <Text style={[styles.paragraph, styles.marginBottom]}>
          We collect the following types of personal and health information:
        </Text>

        <Text style={[styles.subHeading, styles.bold]}>
          a. User-Provided Information
        </Text>
        <Text style={styles.paragraph}>
          Information you give us when registering or using the platform:
        </Text>
        {[
          "Full name, email, phone number",
          "Date of birth, gender, health card number",
          "Login credentials",
          "Health info (symptoms, appointments, etc.)",
        ].map((item, i) => (
          <Text key={`user-${i}`} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}

        <Text style={[styles.subHeading, styles.bold]}>
          b. Automatically Collected Information
        </Text>
        <Text style={styles.paragraph}>Deliver a personalized experience.</Text>
        {[
          "IP address, browser, device type",
          "Location data (if consented)",
          "Pages visited, session activity",
        ].map((item, i) => (
          <Text key={`auto-${i}`} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}

        <Text style={[styles.subHeading, styles.bold]}>
          c. Cookies and Tracking
        </Text>
        {[
          "Maintain your session;",
          "Understand usage patterns;",
          "Deliver a personalized experience.",
        ].map((item, i) => (
          <Text key={`cookie-${i}`} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}

        <Text style={styles.paragraph}>
          You can disable cookies, but some features may be affected.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          4. How We Use Your Information
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.bold]}>Purpose</Text>
            <Text style={[styles.tableCell, styles.bold]}>Description</Text>
          </View>
          {[
            {
              purpose: "Service Delivery",
              desc: "Doctor discovery, booking, consultations",
            },
            {
              purpose: "User Management",
              desc: "Account creation and preference management",
            },
            {
              purpose: "Communications",
              desc: "Notifications, reminders, inquiries",
            },
            {
              purpose: "Analytics",
              desc: "User experience and platform improvements",
            },
            { purpose: "Compliance", desc: "Legal and regulatory obligations" },
          ].map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.bold]}>{row.purpose}</Text>
              <Text style={styles.tableCell}>{row.desc}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.paragraph, styles.bold]}>
          We do not use your health data for advertising purposes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>5. Consent</Text>
        <Text style={styles.paragraph}>
          By using the Platform, you provide{" "}
          <Text style={styles.bold}>express consent</Text> for the collection,
          use, and disclosure of your personal information as described in this
          policy.
        </Text>
        <Text style={styles.paragraph}>
          You may withdraw your consent at any time, subject to legal or
          contractual limitations. To do so, contact us at: [Insert Email
          Address].
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          6. Disclosure of Information
        </Text>
        <Text style={styles.paragraph}>
          We may disclose your personal information under the following
          circumstances:
        </Text>
        {[
          "To Healthcare Providers: We may disclose your personal information under the following circumstances:",
          "To Service Providers: For hosting, payment processing, technical support, and analytics (subject to strict confidentiality agreements).",
          "Legal Compliance: When required by law, regulation, subpoena, or court order.",
          "Business Transfers: When required by law, regulation, subpoena, or court order.",
        ].map((item, i) => (
          <Text key={i} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}
        <Text style={styles.paragraph}>
          We <Text style={styles.bold}>do not</Text> sell or rent personal
          information to third parties.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          7. How We Protect Your Information
        </Text>
        {[
          "Encryption of data at rest and in transit;",
          "Secure servers hosted in data centres located in Canada or jurisdictions with equivalent privacy protections;",
          "Role-based access control to sensitive information;",
          "Regular audits and assessments to ensure data protection policies are followed.",
        ].map((item, i) => (
          <Text key={i} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>8. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain personal information only for as long as necessary to:
        </Text>
        {[
          "To provide services",
          "To meet legal/regulatory obligations",
          "To resolve disputes/enforce agreements",
        ].map((item, i) => (
          <Text key={i} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}
        <Text style={styles.paragraph}>
          When your information is no longer required, it will be securely
          destroyed or anonymized in accordance with industry standards and
          regulatory requirements.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          9. Access to and Correction of Personal Information
        </Text>
        <Text style={styles.paragraph}>
          Under Canadian privacy laws, you have the right to:
        </Text>
        {[
          "Request access to your personal data",
          "Request access to the personal information we hold about you;",
          "Request the deletion of your data, subject to legal limitations (e.g., health record retention laws).",
        ].map((item, i) => (
          <Text key={i} style={styles.listItem}>
            {i + 1}. {item}
          </Text>
        ))}
        <Text style={styles.paragraph}>
          To exercise these rights, please contact our Privacy Officer at:
          [Insert Contact Information].
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          10. Children’s Privacy
        </Text>
        <Text style={styles.paragraph}>
          DOC247 does not knowingly collect personal information from
          individuals under the age of 13. If you are a parent or guardian and
          believe your child has provided us with personal information, please
          contact us immediately so we can delete the data.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>11. Third-Party Links</Text>
        <Text style={styles.paragraph}>
          Our Platform may contain links to third-party websites or
          applications. We are not responsible for the content, security, or
          privacy practices of those third-party sites. We encourage you to
          review their privacy policies.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          12. Cross-Border Data Transfers
        </Text>
        <Text style={styles.paragraph}>
          While we aim to store data within Canada, some service providers may
          operate in other jurisdictions. When data is stored or processed
          outside Canada, it may be subject to the laws of those jurisdictions.
          We take all reasonable steps to ensure that your data remains
          protected in accordance with Canadian standards.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>
          13. Changes to This Privacy Policy
        </Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time to reflect changes
          in technology, legal requirements, or our operations. When we do, we
          will revise the “Last Updated” date and provide notice through the
          Platform if the changes are material. Your continued use of the
          Platform after changes constitutes acceptance of the updated policy.
        </Text>
      </View>

      {/* <View style={styles.section}>
        <Text style={[styles.heading, styles.bold]}>14. Contact Us</Text>
        <Text style={styles.address}>
          <Text style={styles.bold}>Privacy Officer – DOC247</Text>
          {"\n"}
          Email: [Insert Email Address]{"\n"}
          Phone: [Insert Phone Number]{"\n"}
          Mailing Address: [Insert Office Address], Canada
        </Text>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  bold: {
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    marginLeft: 12,
    marginBottom: 6,
    lineHeight: 20,
  },
  marginBottom: {
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PrivacyPolicy;
