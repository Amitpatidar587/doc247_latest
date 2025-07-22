// context/ToastContext.js
import { createContext, useContext, useState, useCallback } from "react";
import ToastMessage from "./ToastMessage";
import { Text } from "react-native";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastMessage
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      {/* <Text>{toast.message}</Text> */}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
