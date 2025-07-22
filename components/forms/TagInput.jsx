import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import PropTypes from "prop-types";
import { Chip, useTheme } from "react-native-paper";

const TagInput = ({
  placeholder = "Add a tag",
  label,
  onChange,
  initialTags = "",
}) => {
  const { colors } = useTheme();
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof initialTags === "string" && initialTags.trim() !== "") {
      const initialArray = initialTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      setTags(initialArray);
    }
  }, [initialTags]);

  const handleAddTag = () => {
    const trimmed = input.trim();
    if (trimmed !== "" && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setInput("");
      if (onChange) onChange(newTags.join(","));
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    if (onChange) onChange(newTags.join(","));
  };

  const handleKeyPress = (text) => {
    if (text.includes(",")) {
      const parts = text.split(",");
      const cleaned = parts[0].trim();

      if (cleaned && !tags.includes(cleaned)) {
        const newTags = [...tags, cleaned];
        setTags(newTags);
        if (onChange) onChange(newTags.join(","));
      }

      setInput(""); // clear input after handling comma
    } else {
      setInput(text);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View style={[styles.inputWrapper, { borderColor: colors.primary }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              style={styles.chip}
              onClose={() => handleRemoveTag(index)}
            >
              {tag}
            </Chip>
          ))}
        </ScrollView>
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          label={label}
          placeholder={placeholder}
          value={input}
          onChangeText={(text) => {
            handleKeyPress(text);
          }}
          onSubmitEditing={handleAddTag}
          // onKeyPress={handleKeyPress}
          placeholderTextColor={colors.placeholder}
        />
      </View>
      <Text style={styles.helperText}>Press Enter or comma to add a tag</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },

  label: {
    position: "absolute",
    top: -10,
    left: 8,
    fontSize: 12,
    marginBottom: 4,
    paddingRight: 8,
    zIndex: 1,
    backgroundColor: "#fff",
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    minWidth: 100,
    padding: 4,
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: "gray",
  },
});

TagInput.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  initialTags: PropTypes.string,
};

export default TagInput;
