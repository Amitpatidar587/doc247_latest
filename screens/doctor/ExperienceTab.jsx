

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,

} from "react-native";
import DatePicker from "react-native-datepicker"; 
import Modal from 'react-native-modal';// You'll need to install this: npm install react-native-datepicker

const ExperienceTab = ({ onSubmit, onCancel }) => {
    
    const [isEmploymentModalVisible, setEmploymentModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [hospital, setHospital] = useState("");
  const [yearOfExperience, setYearOfExperience] = useState("");
  const [location, setLocation] = useState("");
  const [employment, setEmployment] = useState("Full Time");
  const [jobDescription, setJobDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [experiences, setExperiences] = useState([]); // Array to hold multiple experiences

  const handleAddExperience = () => {
    const newExperience = {
     
      title,
      hospital,
      yearOfExperience,
      location,
      employment,
      jobDescription,
      startDate,
      endDate,
      currentlyWorking,
    };
    setExperiences([...experiences, newExperience]);
    
    setTitle("");
    setHospital("");
    setYearOfExperience("");
    setLocation("");
    setEmployment("Full Time");
    setJobDescription("");
    setStartDate("");
    setEndDate("");
    setCurrentlyWorking(false);
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const handleReset = () => {
   
    setTitle("");
    setHospital("");
    setYearOfExperience("");
    setLocation("");
    setEmployment("Full Time");
    setJobDescription("");
    setStartDate("");
    setEndDate("");
    setCurrentlyWorking(false);
  };
  const toggleEmploymentModal = () => {
    setEmploymentModalVisible(!isEmploymentModalVisible);
  };

  const selectEmployment = (type) => {
    setEmployment(type);
    setEmploymentModalVisible(false);
  };
  const handleSubmit = () => {
    onSubmit(experiences); // Pass the array of experiences
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
      
      <View style={styles.header}>
      <Text style={styles.title}>Experience</Text>
      </View>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Hospital *"
          value={hospital}
          onChangeText={setHospital}
        />
        <TextInput
          style={styles.input}
          placeholder="Year of Experience *"
          value={yearOfExperience}
          onChangeText={setYearOfExperience}
        />
        <TextInput
          style={styles.input}
          placeholder="Location *"
          value={location}
          onChangeText={setLocation}
        />
         <View style={styles.selectContainer}>
          <Text>Employment</Text>
          <TouchableOpacity style={styles.selectButton} onPress={toggleEmploymentModal}>
            <Text>{employment}</Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={isEmploymentModalVisible} onBackdropPress={toggleEmploymentModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => selectEmployment('Full Time')}>
              <Text>Full Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => selectEmployment('Part Time')}>
              <Text>Part Time</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <TextInput
          style={styles.textarea}
          placeholder="Job Description *"
          value={jobDescription}
          onChangeText={setJobDescription}
          multiline
        />

        <View style={styles.dateContainer}>
          <DatePicker
            style={styles.datePicker}
            date={startDate}
            mode="date"
            placeholder="Start Date *"
            format="YYYY-MM-DD"
            onDateChange={setStartDate}
          />
          <DatePicker
            style={styles.datePicker}
            date={endDate}
            mode="date"
            placeholder="End Date *"
            format="YYYY-MM-DD"
            onDateChange={setEndDate}
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setCurrentlyWorking(!currentlyWorking)}
        >
          <View
            style={[
              styles.checkbox,
              currentlyWorking && styles.checkedCheckbox,
            ]}
          />
          <Text>I Currently Working Here</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddExperience}
        >
          <Text>Add New Experience</Text>
        </TouchableOpacity>
      </View>

      {experiences.map((exp, index) => (
        <View key={index} style={styles.experienceItem}>
          <Text>{`${exp.hospital}, <span class="math-inline">\{exp\.location\} \(</span>{exp.startDate} - ${exp.endDate})`}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteExperience(index)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalOption: {
    padding: 10,
  },

  selectButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    height: 100,
    textAlignVertical: "top",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  datePicker: {
    width: "48%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: "#007bff",
  },
  resetButton: {
    backgroundColor: "#f0f0f0",
    color:"#fb1707",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  experienceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: "white",
  },
});
export default ExperienceTab;
