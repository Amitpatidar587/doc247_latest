import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomTextInput from "../../components/forms/CustomTextInput";
import CustomButton from "../../components/forms/CustomButton";
import { useTheme } from "react-native-paper";
import {
  logIn,
  resetAuthState,
} from "../../redux/slices/app_common/auth/authSlice";
import { navigate } from "../../navigationRef.js";

const LoginScreen = ({ navigation, route }) => {
  const { role } = route.params || { role: "patient" };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const { loading, success, message } = useSelector((state) => state.auth);
  const { colors } = useTheme();
  const user_type = role;

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleLogin = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      const credentials = { email, password, user_type };
      dispatch(logIn(credentials));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(resetAuthState());
  }, []);

  useEffect(() => {
    if (message === null) return;
    if (success) {
      dispatch(resetAuthState());
    }
  }, [message, success, dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subHeading}>Please log in to continue.</Text>

      <CustomTextInput
        label="Email"
        value={email}
        onChangeText={(val) => {
          setEmail(val);
          if (emailError) setEmailError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <CustomTextInput
        label="Password"
        value={password}
        onChangeText={(val) => {
          setPassword(val);
          if (passwordError) setPasswordError("");
        }}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {!success && message ? (
        <Text style={styles.errorText}>{message}</Text>
      ) : null}

      <CustomButton
        onPress={handleLogin}
        title={
          user_type.charAt(0).toUpperCase() + user_type.slice(1) + " Login"
        }
        disabled={loading || !email || !password}
        loading={loading}
      />

      <Text style={styles.link} onPress={() => navigate("ForgotPassword")}>
        Forget Password
      </Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Signup", { role })}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
  link: {
    color: "#0474ed",
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    textAlign: "left",
  },
});

export default LoginScreen;
