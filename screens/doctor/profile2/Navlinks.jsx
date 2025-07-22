import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
// import Info from "./Info";
// import Stories from "./Stories";
// import ConsultQA from "./ConsultQA";
// import HealthFeed from "./HealthFeed";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";
import AwardCard from "./AwardCard";
import Reviews from "../../../components/Reviews";

const tabs = [
  "Reviews",
  "Education",
  "Experience",
  "Awards",

  // "Stories",
  // "Consult Q&A",
  // "Healthfeed",
];

const NavLinks = (props) => {
  const [activeTab, setActiveTab] = useState("Reviews");
  // console.log("doctorid", props.doctorid);
  const renderTabContent = () => {
    switch (activeTab) {
      case "Reviews":
        return (
          <Reviews
            targetId={props.doctorid}
            targetType="doctor"
            userRolePass="patient"
          />
        );
      case "Education":
        return <EducationCard data={props.data?.education} />;
      case "Experience":
        return <ExperienceCard data={props.data?.experience} />;
      case "Awards":
        return <AwardCard data={props.data?.awards} />;

      // case "Stories":
      //   return <Stories />;
      // case "Consult Q&A":
      //   return <ConsultQA />;
      // case "Healthfeed":
      //   return <HealthFeed />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <FlatList
        horizontal
        data={tabs}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.tabList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tabItem, activeTab === item && styles.activeTab]}
            onPress={() => setActiveTab(item)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === item
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Tab Content */}
      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    //   backgroundColor: '#fff',
  },
  tabList: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 8,
  },
  activeTab: {
    borderColor: "#0d6efd",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#0d6efd",
  },
  inactiveTabText: {
    color: "#666",
  },
  contentContainer: {
    flex: 1,
  },
});

export default NavLinks;
