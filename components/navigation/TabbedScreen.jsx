import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import CustomTabBar from "./CustomTabBar";

import { useTheme } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

const TabbedScreen = ({ tabs = [], headerComponent }) => {
  const { colors } = useTheme();

  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState(tabs[0]?.name || "");

  const tabNames = tabs.map((tab) => tab.name);
  const currentIndex = tabNames.indexOf(activeTab);

  const handleTabChange = (tabName) => {
    const index = tabNames.indexOf(tabName);
    scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    setActiveTab(tabName);
  };

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setActiveTab(tabNames[index]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      {headerComponent}

      {/* Tab Bar */}
      <CustomTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        containerStyle={{ backgroundColor: colors.background }}
        tabStyle={{ backgroundColor: colors.surface }}
        activeTabStyle={{ borderBottomColor: colors.primary }}
        textStyle={{ color: colors.text }}
        activeTextStyle={{ color: colors.primary }}
      />

      {/* Horizontal Swipeable Content */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {tabs.map((tab, index) => (
          <View
            key={tab.name}
            style={[styles.tabContent, { width: screenWidth }]}
          >
            {tab.component}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
});

export default TabbedScreen;
