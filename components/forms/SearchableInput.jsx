import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import PropTypes from "prop-types";
import CustomTextInput from "./CustomTextInput";

const SearchableInput = ({
  value,
  label,
  placeholder,
  name,
  style,
  searchArray = [],
  onInputChange,
  setValue, // ⬅️ setter for the selected value
  editable = true,
  keyName = "name",
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleSuggestionClick = (item) => {
    const selectedText = typeof item === "string" ? item : item?.[keyName];
    setValue(selectedText);
    setSuggestions([]);
  };

  const handleInputChange = (text) => {
    setValue(text);

    // Call the debounced API search
    if (typeof onInputChange === "function") {
      onInputChange(text);
    }

    // Filter suggestions locally
    if (text.trim() !== "") {
      const filtered = searchArray.filter((item) => {
        const label = typeof item === "string" ? item : item?.[keyName] ?? "";
        return label.toLowerCase().includes(text.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      <CustomTextInput
        value={value}
        label={label}
        placeholder={placeholder}
        onChangeText={handleInputChange}
        onFocus={() => handleInputChange(value)}
        editable={editable}
      />

      {suggestions.length > 0 && (
        <View style={styles.dropdown}>
          {suggestions.map((item, index) => {
            const label =
              typeof item === "string" ? item : item?.[keyName] ?? "";
            return (
              <TouchableOpacity
                key={index.toString()}
                style={styles.item}
                onPress={() => handleSuggestionClick(item)}
              >
                <Text style={styles.text}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

SearchableInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  style: PropTypes.object,
  editable: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
  searchArray: PropTypes.array,
  keyName: PropTypes.string,
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
    zIndex: 10, // to ensure it's above modals or other content
  },
  dropdown: {
    position: "absolute",
    top: 60, // adjust based on CustomTextInput height
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 150,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 14,
  },
});

export default SearchableInput;
