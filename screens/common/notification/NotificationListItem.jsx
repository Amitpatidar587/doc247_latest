import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { formatDistanceToNow } from "date-fns";

const NotificationListItem = ({ notification, onPress }) => {
  const createdAt = notification?.created_at;
  const isUnread = notification?.is_read === 0;
  // console.log("NotificationListItem notification:", notification);

  const getRelativeTime = (dateString) => {
    if (!dateString) return "Just now";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";

    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      console.log("Date parsing error:", e);
      return "Just now";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.unreadContainer]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isUnread && styles.unreadText]}>
            {notification?.title || "Notification"}
          </Text>
          <Text style={styles.time}>{getRelativeTime(createdAt)}</Text>
        </View>
        <Text style={[styles.message, isUnread && styles.unreadText]}>
          {notification?.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  unreadContainer: {
    backgroundColor: "#e6f7ff", // light blue background for unread
  },
  // content: {
  //   marginLeft: 8,
  //   flex: 1,
  // },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    flexShrink: 1,
  },
  time: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  unreadText: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default NotificationListItem;
