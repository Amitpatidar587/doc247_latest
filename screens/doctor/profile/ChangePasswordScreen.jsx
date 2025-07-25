import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  resetAuthState,
} from "../../../redux/slices/app_common/auth/authSlice";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import { useToast } from "../../../components/utility/Toast";
import CustomButton from "../../../components/forms/CustomButton.jsx";

export default function ChangePasswordScreen() {
  const dispatch = useDispatch();
  const { loading, message, success, user, userRole } = useSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    old_password: "",
    new_password: "",
    conferm_new_password: "",
    user_type: userRole,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.old_password) {
      newErrors.old_password = "Current password is required.";
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required.";
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = "New password must be at least 6 characters.";
    }

    if (formData.conferm_new_password !== formData.new_password) {
      newErrors.conferm_new_password = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (message !== null) {
      showToast(message, success ? "success" : "error");
      dispatch(resetAuthState());

      if (success) {
        setFormData({
          ...formData,
          old_password: "",
          new_password: "",
          conferm_new_password: "",
        });
      }
    }
  }, [message, success, dispatch]);

  const handleSubmit = () => {
    if (!validateForm()) return;
    dispatch(changePassword({ data: formData }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <CustomTextInput
            label="Current Password"
            value={formData.old_password}
            onChangeText={(value) => handleChange("old_password", value)}
            secureTextEntry
            error={errors.old_password}
          />

          <CustomTextInput
            label="New Password"
            value={formData.new_password}
            onChangeText={(value) => handleChange("new_password", value)}
            secureTextEntry
            error={errors.new_password}
          />

          <CustomTextInput
            label="Confirm New Password"
            value={formData.conferm_new_password}
            onChangeText={(value) =>
              handleChange("conferm_new_password", value)
            }
            secureTextEntry
            error={errors.conferm_new_password}
          />

          <CustomButton
            onPress={handleSubmit}
            disabled={loading}
            title={"Change Password"}
            loading={loading}
          ></CustomButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({ label, value, onChangeText, secureTextEntry, error }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, error && styles.inputError]}
        secureTextEntry={secureTextEntry}
        placeholder={label}
        placeholderTextColor="#999"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // paddingTop: 50,
    // flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    // height: "100%",
  },
  card: {
    // backgroundColor: "#ffffff",
    // borderRadius: 10,
    padding: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 6,
    // elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
