import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

//Import individual tab components
import BasicDetailsTab from "./BasicDetailsTab";
import ExperienceTab from "./ExperienceTab";
import EducationTab from "./EducationTab";
import ClinicsTab from "./ClinicsTab";
import BusinessHoursTab from "./BusinessHoursTab";

const ProfileTab = () => {
  const [activeTab, setActiveTab] = useState("Basic Details");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Basic Details":
        return <BasicDetailsTab />;
      case "Experience":
        return <ExperienceTab />;
      case "Education":
        return <EducationTab />;
      case "Clinics":
        return <ClinicsTab />;
      case "Business Hours":
        return <BusinessHoursTab />;
      default:
        return null;
    }
  };

  const tabs = [
    "Basic Details",
    "Experience",
    "Education",
    "Clinics",
    "Business Hours",
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "white",
  },
  activeTab: {
    backgroundColor: "#1E90FF",
  },
  tabText: {
    fontSize: 16,
    color: "black",
  },
  activeTabText: {
    color: "white",
  },
  contentContainer: {
    padding: 10,
  },
});

export default ProfileTab;

// import { useState } from "react";
// import { View,Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import HorizontalTabs from "./HorizontalTabs";
// import ProfileScreen from "../ProfileScreen";

// const ProfileTab = ({ activeTab, onTabPress }) => {
//     const [selectedTab, setSelectedTab] = useState('Basic Details');
//     const [content, setContent] = useState(null);

//     const handleTabPress = (tab) => {
//       setSelectedTab(tab);
//       switch (tab) {
//         case 'Basic Details':
//           // Render Basic Details content
//          // console.log('Displaying Basic Details content');
//           setContent(<ProfileScreen />);
//           break;
//         case 'Experience':
//           // Render Experience content
//           console.log('Displaying Experience content');
//           // Example: setContent(<ExperienceComponent />);
//           break;
//         case 'Education':
//           // Render Education content
//           console.log('Displaying Education content');
//           // Example: setContent(<EducationComponent />);
//           break;
//         case 'Awards':
//           // Render Awards content
//           console.log('Displaying Awards content');
//           // Example: setContent(<AwardsComponent />);
//           break;
//         case 'Insurances':
//           // Render Insurances content
//           console.log('Displaying Insurances content');
//           // Example: setContent(<InsurancesComponent />);
//           break;
//         case 'Clinics':
//           // Render Clinics content
//           console.log('Displaying Clinics content');
//           // Example: setContent(<ClinicsComponent />);
//           break;
//         case 'Business Hours':
//           // Render Business Hours content
//           console.log('Displaying Business Hours content');
//           // Example: setContent(<BusinessHoursComponent />);
//           break;
//         default:
//           // Handle default case or error
//           console.log('Unknown tab selected');
//           break;
//       }
//     };

//     return (
//         <View>
//           <HorizontalTabs activeTab={selectedTab} onTabPress={handleTabPress} />
//       {content}
//       <Text style={{paddingLeft: "20px"}}>Basic Information</Text>
//         </View>
//       );
// }
// export default ProfileTab;
