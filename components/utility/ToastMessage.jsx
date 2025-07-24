/* eslint-disable quotes */
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const toastColors = {
  success: "#4CAF50",
  error: "#F44336",
  info: "#2196F3",
  warning: "#FF9800",
};

const toastIcons = {
  success: "check-circle",
  error: "alert-circle",
  info: "information",
  warning: "alert",
};

const ToastMessage = ({ message, type = "info", visible, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, slideAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: toastColors[type],
        },
      ]}
    >
      <MaterialCommunityIcons
        name={toastIcons[type]}
        size={20}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
    flexWrap: "wrap",
  },
});

export default ToastMessage;
