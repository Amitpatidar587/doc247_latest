import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button,Text } from "react-native-paper";
import CustomTextInput from "../../components/forms/CustomTextInput";
import CustomButton from "../../components/forms/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  resetAuthState,
} from "../../redux/slices/app_common/auth/authSlice";
import { useToast } from "../../components/utility/Toast.js";

const ForgotPasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error, message, success } = useSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    dispatch(resetAuthState());
  }, [message, success, dispatch, error]);

  useEffect(() => {
    if (error && error?.email) {
      setEmailError(error.email);
    } else {
      setEmailError("");
    }
  }, [error]);

  const validateEmail = (value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email");
      return;
    }

    setEmailError("");
    dispatch(forgotPassword({ email }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <Text style={styles.subHeading}>
        {"Enter your email address to reset your password."}
      </Text>
      {/* <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />
      {emailError && <Text style={{ color: "red" }}>{emailError}</Text>} */}
      <CustomTextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Email"
        style={styles.input}
        error={emailError}
      />
      <CustomButton
        title="Forgot Password"
        onPress={handleSubmit}
        loading={loading}
      />
      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
        style={styles.backToLoginButton}
        textColor="#0474ed"
      >
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    marginBottom: 30,
    backgroundColor: "#fff",
  },
  resetButton: {
    marginTop: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subHeading: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  backToLoginButton: {
    marginTop: 10,
    alignSelf: "center",
  },
});

export default ForgotPasswordScreen;
