import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from "react-native";
import { TextInput, Button, Text, Surface, useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

const CustomSelect = ({ label, value, options = [], onSelect, icon = "menu-down" }, disabled)  => {
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
  
  // Ensure options are in the correct format
  const normalizedOptions = Array.isArray(options) 
    ? options.map(opt => 
        typeof opt === 'object' && opt.value !== undefined && opt.label !== undefined
          ? opt
          : { value: opt, label: String(opt) }
      )
    : [];
  
  // Find the selected option label
  const selectedLabel = normalizedOptions.find(opt => opt.value === value)?.label || "";
  
  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <TextInput
          label={label}
          value={selectedLabel}
          editable={false}
          style={[styles.input, { backgroundColor: colors.surface }]}
          mode="outlined"
          right={<TextInput.Icon icon={icon} />}
        />
      </TouchableOpacity>
      
      {!disabled && (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={[styles.surface, { backgroundColor: colors.surface }]} elevation={5}>
            <Text style={[styles.title, { color: colors.text }]}>Select {label}</Text>
            
            <ScrollView style={styles.scrollView}>
              {normalizedOptions.length > 0 ? (
                normalizedOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      onSelect(option.value);
                      setVisible(false);
                    }}
                    style={[
                      styles.optionContainer,
                      value === option.value && { backgroundColor: colors.primary }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.optionText, 
                        value === option.value && { color: colors.onPrimary }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={[styles.noOptions, { color: colors.text }]}>No options available</Text>
              )}
            </ScrollView>
            
            <Button 
              mode="outlined" 
              onPress={() => setVisible(false)}
              style={styles.cancelButton}
              textColor={colors.primary}
            >
              Cancel
            </Button>
          </Surface>
        </View>
      </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: { 
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  surface: {
    padding: 16,
    borderRadius: 8,
    width: screenWidth * 0.85,
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center"
  },
  scrollView: {
    maxHeight: 300,
    width: "100%",
    marginBottom: 12
  },
  optionContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  optionText: {
    fontSize: 16
  },
  noOptions: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20
  },
  cancelButton: {
    marginTop: 8
  }
});

export default CustomSelect;
