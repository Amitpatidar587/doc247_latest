import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import {
  List,
  Switch,
  useTheme,
  Modal,
  Portal,
  Button,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/app_common/utility/themeSlice";
import PrivacyPolicy from "./auth/PrivacyPolicy";
import TermsAndConditions from "./auth/TermsAndCondition";

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { isDarkMode, theme } = useSelector((state) => state.theme);

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [activeDocument, setActiveDocument] = React.useState(null); // "privacy" or "terms"

  const openModal = (docType) => {
    setActiveDocument(docType);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveDocument(null);
  };

  const renderDocument = () => {
    switch (activeDocument) {
      case "privacy":
        return <PrivacyPolicy />;
      case "terms":
        return <TermsAndConditions />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeDocument) {
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms and Conditions";
      default:
        return "";
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <List.Section>
        {/* <List.Subheader
          style={[styles.subheader, { color: theme.colors.primary }]}
        >
          Preferences
        </List.Subheader> */}

        {/* <List.Item
          title="Notifications"
          titleStyle={{ color: theme.colors.text }}
          style={[styles.listItem, { backgroundColor: theme.colors.surface }]}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={() =>
                setNotificationsEnabled(!notificationsEnabled)
              }
              color={theme.colors.primary}
            />
          )}
        /> */}

        {/* <List.Item
          title="Dark Mode"
          titleStyle={{ color: theme.colors.text }}
          style={[styles.listItem, { backgroundColor: theme.colors.surface }]}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={() => dispatch(toggleTheme())}
              color={theme.colors.primary}
            />
          )}
        /> */}

        <List.Subheader
          style={[styles.subheader, { color: theme.colors.primary }]}
        >
          Legal
        </List.Subheader>

        <List.Item
          title="Privacy Policy"
          titleStyle={{ color: theme.colors.primary }}
          style={[styles.listItem, { backgroundColor: theme.colors.surface }]}
          onPress={() => openModal("privacy")}
        />

        <List.Item
          title="Terms of Service"
          titleStyle={{ color: theme.colors.primary }}
          style={[styles.listItem, { backgroundColor: theme.colors.surface }]}
          onPress={() => openModal("terms")}
        />
      </List.Section>

      {/* Combined Modal for Privacy & Terms */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <ScrollView>{renderDocument()}</ScrollView>
          <Button mode="contained" onPress={closeModal}>
            Close
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  subheader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    // margin: 20,
    padding: 10,
    borderRadius: 10,
    maxHeight: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default SettingsScreen;
