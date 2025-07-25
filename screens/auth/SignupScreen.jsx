import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation, UIManager } from "react-native";
import { useTheme, Text, Modal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAuthState,
  signUp,
  verifyOtp,
} from "../../redux/slices/app_common/auth/authSlice";
import CustomButton from "../../components/forms/CustomButton";
import CustomSelect from "../../components/forms/CustomSelect";
import PhoneInput from "../../components/forms/PhoneInput";
import CustomTextInput from "../../components/forms/CustomTextInput";
import TermsAndConditions from "./TermsAndCondition";
import { useToast } from "../../components/utility/Toast";

const SignupScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { role } = route.params || { role: "patient" };
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    is_agreed: false,
    doctor_type: "",
    country_code: "+1",
    contact: "",
  });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false); // Modal visibility

  const { success, message, loading, email } = useSelector(
    (state) => state.auth
  );

  console.log(success, message, loading);

  const { colors } = useTheme();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.is_agreed)
      newErrors.is_agreed = "You must agree to the terms.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}, []);


  useEffect(() => {
    if (message == null) return;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    showToast(message, success ? "success" : "error");
    if (success) {
      setShowOtpInput(true);
    }
    dispatch(resetAuthState());
  }, [success, message, dispatch]);

  const handleSignup = async () => {
    // console.log(validateForm())
    if (!validateForm()) return;
    const payload = {
      ...formData,
      user_type: role,
    };

    const res = await dispatch(signUp(payload)).unwrap();
    if (res?.success) {
      setShowOtpInput(true);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      return;
    }
    try {
      await dispatch(verifyOtp({ email: formData.email, otp })).unwrap();
      navigation.navigate("Login", { role });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhoneChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      country_code: data.country_code,
      contact: data.contact,
    }));
  };

  const doctorTypes = [
    { label: "General Practitioner", value: "general_practitioner" },
    { label: "Pediatrician", value: "pediatrician" },
    { label: "Dentist", value: "dentist" },
    { label: "Cardiologist", value: "cardiologist" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account for {role}</Text>
      {!showOtpInput && (
        <View>
          <CustomTextInput
            style={styles.input}
            label="First Name"
            value={formData.first_name}
            onChangeText={(text) => handleChange("first_name", text)}
            editable={!showOtpInput}
          />
          {errors.first_name && (
            <Text style={styles.error}>{errors.first_name}</Text>
          )}

          <CustomTextInput
            style={styles.input}
            label="Last Name"
            value={formData.last_name}
            onChangeText={(text) => handleChange("last_name", text)}
            editable={!showOtpInput}
          />
          {errors.last_name && (
            <Text style={styles.error}>{errors.last_name}</Text>
          )}

          <CustomTextInput
            style={styles.input}
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!showOtpInput}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <PhoneInput
            label="Phone Number"
            defaultValue={{
              country_code: formData?.country_code || "+1",
              contact: formData?.contact,
            }}
            onChange={handlePhoneChange}
            editable={!showOtpInput}
          />
          {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

          {role === "doctor" && (
            <CustomSelect
              label="Doctor Type"
              value={formData.doctor_type}
              options={doctorTypes}
              onSelect={(value) => handleChange("doctor_type", value)}
              icon="menu-down"
            />
          )}

          <CustomTextInput
            style={styles.input}
            label="Password"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            editable={!showOtpInput}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
        </View>
      )}
      {!showOtpInput && (
        <>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => handleChange("is_agreed", !formData.is_agreed)}
              style={{
                width: 24,
                height: 24,
                borderWidth: 1,
                borderColor: "#aaa",
                borderRadius: 4,
                backgroundColor: formData.is_agreed ? "#4CAF50" : "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              {formData.is_agreed && (
                <Text style={{ color: "white", fontWeight: "bold" }}>✓</Text>
              )}
            </TouchableOpacity>
            {/* <Checkbox
              status={formData.is_agreed ? "checked" : "unchecked"}
              onPress={() => handleChange("is_agreed", !formData.is_agreed)}
              color="#4CAF50"
              style={{ marginRight: 10 , borderWidth: 1, borderColor: "#333", backgroundColor: "#ccc"}}
            /> */}
            <Text style={styles.checkboxLabel}>
              I agree to the{" "}
              <Text style={styles.link} onPress={() => setTermsVisible(true)}>
                Terms and Conditions
              </Text>
            </Text>
          </View>
          {errors.is_agreed && (
            <Text style={styles.error}>{errors.is_agreed}</Text>
          )}
        </>
      )}

      {!showOtpInput ? (
        <CustomButton
          onPress={handleSignup}
          title="Sign Up"
          disabled={
            !formData.email ||
            !formData.password ||
            !formData.first_name ||
            !formData.last_name ||
            !formData.is_agreed
          }
          loading={loading}
        />
      ) : (
        <>
          <CustomTextInput
            style={styles.input}
            label="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          {errors.otp && <Text style={styles.error}>{errors.otp}</Text>}
          <CustomButton
            onPress={handleOtpSubmit}
            title="Verify OTP"
            disabled={loading || otp.length !== 6}
            loading={loading}
          />
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Already have an account? Log In</Text>
      </TouchableOpacity>

      {/* Terms and Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsVisible}
        onRequestClose={() => setTermsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <TermsAndConditions />
            </ScrollView>
            \{" "}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#555",
  },
  link: {
    color: "#4CAF50",
    textDecorationLine: "underline",
  },
  loginLink: {
    marginTop: 20,
    color: "#4CAF50",
    textAlign: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "white",
    // borderRadius: 20,
    // padding:,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    // marginBottom: 15,
    textAlign: "center",
  },
  modalContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  closeButton: {
    borderRadius: 50,
    borderWidth: 1,
    minWidth: 150,
    marginVertical: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SignupScreen;
