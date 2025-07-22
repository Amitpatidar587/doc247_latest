import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Text, useTheme } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH / 4; // Show 4 tabs at once

const CustomTabBar = ({
  tabs,
  activeTab,
  onTabChange,
  tabStyle = {},
  activeTabStyle = {},
  textStyle = {},
  activeTextStyle = {},
  containerStyle = {},
}) => {
  const flatListRef = useRef(null);
  const activeIndex = tabs.findIndex(
    (item) => (item.name || item) === activeTab
  );
  const { colors } = useTheme();

  useEffect(() => {
    if (activeIndex >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: activeIndex, animated: true });
    }
  }, [activeIndex]);

  return (
    <View
      style={[
        { overflow: "hidden" },
        styles.container,
        { backgroundColor: colors.background },
        containerStyle,
      ]}
    >
      <FlatList
        ref={flatListRef}
        data={tabs}
        horizontal
        keyExtractor={(item) => item.name || item.id || item.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
        getItemLayout={(data, index) => ({
          length: TAB_WIDTH,
          offset: TAB_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 100);
        }}
        renderItem={({ item }) => {
          const name = item.name || item;
          const isActive = activeTab === name;
          return (
            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  minWidth: TAB_WIDTH,
                  borderBottomColor: isActive
                    ? colors.primary
                    : colors.surfaceDisabled,
                },
                tabStyle,
                isActive && activeTabStyle,
              ]}
              onPress={() => onTabChange(name)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.primary : colors.onBackground },
                  textStyle,
                  isActive && activeTextStyle,
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor is now set via useTheme()
  },
  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomTabBar;
