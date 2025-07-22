import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";

const treatmentFilters = [
  "Dental Fillings",
  "Dental Cleaning",
  "Wisdom Tooth Extraction",
  "RCT - Root Canal Treatment",
];

const sortOptions = ["Most Helpful", "Most Recent"];

const PatientStoriesFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  return (
    <View style={styles.wrapper}>
      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        These are patients' opinions and do not necessarily reflect the doctor's
        medical capabilities.{" "}
        <Text style={styles.link} onPress={() => Linking.openURL("#")}>
          Read more
        </Text>
      </Text>

      {/* Filter Section */}
      <View style={styles.filterBox}>
        <Text style={styles.filterLabel}>
          Filter by{" "}
          <Text style={styles.mutedText}>health problem/treatment</Text>
        </Text>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.buttonScroll}
        >
          <TouchableOpacity
            style={[styles.chip, selectedFilter === "All" && styles.activeChip]}
            onPress={() => setSelectedFilter("All")}
          >
            <Text
              style={[
                styles.chipText,
                selectedFilter === "All" && styles.activeChipText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {treatmentFilters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selectedFilter === filter && styles.activeChip,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilter === filter && styles.activeChipText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort and Result Count */}
      <View style={styles.sortRow}>
        <Text style={styles.resultText}>63 results</Text>

        {/* Sort Buttons */}
        <View style={styles.sortOptions}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedSort(option)}
              style={[
                styles.sortChip,
                selectedSort === option && styles.selectedSortChip,
              ]}
            >
              <Text
                style={[
                  styles.sortText,
                  selectedSort === option && styles.selectedSortText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: "#6c757d",
  },
  link: {
    color: "#0d6efd",
    textDecorationLine: "underline",
  },
  filterBox: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
  },
  filterLabel: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 6,
  },
  mutedText: {
    color: "#6c757d",
  },
  buttonScroll: {
    flexDirection: "row",
    marginTop: 8,
  },
  chip: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: {
    color: "#0d6efd",
    fontSize: 12,
  },
  activeChip: {
    backgroundColor: "#0d6efd",
  },
  activeChipText: {
    color: "#fff",
    fontSize: 12,
  },
  sortRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultText: {
    fontWeight: "600",
    fontSize: 14,
  },
  sortOptions: {
    flexDirection: "row",
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginLeft: 8,
  },
  selectedSortChip: {
    backgroundColor: "#0d6efd",
  },
  sortText: {
    color: "#0d6efd",
    fontSize: 12,
  },
  selectedSortText: {
    color: "#fff",
  },
});


export default PatientStoriesFilter;
