import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import PropTypes from "prop-types";
import TagInput from "../../../components/forms/TagInput";
import CustomDatePicker from "../../../components/modals/CustomDatePicker";
import CustomTextInput from "../../../components/forms/CustomTextInput";

const AdditionalInfo = ({ additionaldetail = {}, onChange }) => {
  const handleInputChange = (name, value) => {
    onChange({ ...additionaldetail, [name]: value });
  };

  const handleTagChange = (name, values) => {
    // console.log(values);
    onChange({ ...additionaldetail, [name]: values });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.sectionTitle}>Other Information</Text> */}

      <View style={styles.fieldContainer}>
        {/* <Text style={styles.label}>Previous Medical History</Text> */}
        <CustomTextInput
          label="Previous Medical History"
          // multiline={true}
          // numberOfLines={3}
          value={additionaldetail.previous_medical_history}
          onChangeText={(text) =>
            handleInputChange("previous_medical_history", text)
          }
        />
      </View>

      <View style={styles.fieldContainer}>
        <TagInput
          // textAlignHorizontal="left"
          placeholder="Add Notes"
          label={"Clinical Notes"}
          value={additionaldetail?.clinical_notes}
          initialTags={additionaldetail?.clinical_notes}
          onChange={(values) => handleTagChange("clinical_notes", values)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <TagInput
          placeholder="Add test notes"
          label={"Laboratory Tests"}
          value={additionaldetail?.laboratory_tests}
          initialTags={additionaldetail?.laboratory_tests}
          onChange={(values) => handleTagChange("laboratory_tests", values)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <TagInput
          placeholder="Add Complaints"
          label={"Complaints"}
          value={additionaldetail?.complaints}
          initialTags={additionaldetail?.complaints}
          onChange={(values) => handleTagChange("complaints", values)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <CustomTextInput
          // multiline={true}
          // numberOfLines={3}
          placeholder="Enter advice..."
          label="Advice"
          value={additionaldetail.advice}
          onChangeText={(text) => handleInputChange("advice", text)}
        />
      </View>
      <View style={styles.fieldContainer}>
        <CustomTextInput
          // multiline={true}
          // numberOfLines={3}
          placeholder="Enter follow-up details..."
          label="Follow Up"
          value={additionaldetail.follow_up}
          onChangeText={(text) => handleInputChange("follow_up", text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <CustomDatePicker
          label={"Follow Up Date"}
          onDateChange={(date) => handleInputChange("follow_up_date", date)}
          disablePastDates={true}
          value={additionaldetail.follow_up_date}
          icon="calendar"
          // minDate={new Date()} // Set the minimum date to today
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  followUpTitle: {
    marginTop: 30,
  },
  fieldContainer: {
    marginVertical: 8,
  },
  label: {
    // fontSize: 12,
    // color: "#555",
    marginBottom: 4,
  },
});

export default AdditionalInfo;
