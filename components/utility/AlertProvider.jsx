import React, { createContext, useContext, useState, useRef } from "react";
import {
  View,

  TouchableOpacity,
  
  StyleSheet,
  Animated,
} from "react-native";
import { Modal, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Alert Types with Icons and Colors
const ALERT_TYPES = {
  success: {
    backgroundColor: "#4CAF50",
    color: "white",
    icon: "check-circle",
  },
  error: {
    backgroundColor: "#F44336",
    color: "white",
    icon: "close-circle",
  },
  warning: {
    backgroundColor: "#FF9800",
    color: "white",
    icon: "alert-circle",
  },
  info: {
    backgroundColor: "#2196F3",
    color: "white",
    icon: "information",
  },
};

// Create a context
const AlertContext = createContext();

// Hook to use alert
export const useAlert = () => useContext(AlertContext);

// Alert Provider Component
export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "info",
    title: "",
    message: "",
    buttons: [],
  });

  const slideAnim = useRef(new Animated.Value(-200)).current;

  const showAlert = ({
    type = "info",
    title = "",
    message = "",
    buttons = [{ text: "OK" }],
  }) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      buttons,
    });

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideAlert = () => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setAlertConfig((prev) => ({ ...prev, visible: false }));
    });
  };

  const handleButtonPress = (onPress) => {
    hideAlert();
    if (typeof onPress === "function") {
      onPress();
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertConfig.visible && (
        <CustomAlertModal
          slideAnim={slideAnim}
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={hideAlert}
          handleButtonPress={handleButtonPress}
        />
      )}
    </AlertContext.Provider>
  );
};

// Custom Alert Modal Component
const CustomAlertModal = ({
  slideAnim,
  visible,
  type = "info",
  title,
  message,
  buttons,
  handleButtonPress,
}) => {
  const alertStyle = ALERT_TYPES[type] || ALERT_TYPES.info;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            { backgroundColor: alertStyle.backgroundColor },
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Icon
            name={alertStyle.icon}
            size={40}
            color={alertStyle.color}
            style={styles.icon}
          />

          {title ? (
            <Text style={[styles.titleText, { color: alertStyle.color }]}>
              {title}
            </Text>
          ) : null}

          <Text style={[styles.messageText, { color: alertStyle.color }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handleButtonPress(button.onPress)}
              >
                <Text style={[styles.buttonText, { color: alertStyle.color }]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    // pointerEvents: "box-none",
  },
  alertContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
  icon: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AlertProvider;
