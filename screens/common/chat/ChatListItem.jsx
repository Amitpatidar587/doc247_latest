import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Text } from "react-native-paper";

const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const ChatListItem = ({ chat, onPress, unread_count }) => {
  const { senderId } = useSelector((state) => state.auth); // Get logged-in user ID

  const isSender = chat.sender_id === senderId;

  // Dynamically choose opposite party's info
  const oppositeName = isSender ? chat?.receiver_name : chat?.sender_name;
  const avatarUrl = isSender
    ? chat?.receiver_profile_image
    : chat?.sender_profile_image;
  const hasImage = !!avatarUrl;

  const updatedAt = chat?.updated_at || chat?.created_at;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(chat)}>
      {hasImage ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.fallbackAvatar}>
          <Text style={styles.fallbackText}>{getInitials(oppositeName)}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {oppositeName}
          </Text>
          <Text style={styles.time}>
            {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat?.message || "No messages yet"}
          </Text>
          {/* Optional: unread badge */}
          {chat.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat?.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 12,
  },
  fallbackAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textTransform: "capitalize",
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: "#999",
    marginLeft: 6,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    alignItems: "center",
  },
  lastMessage: {
    color: "#666",
    flex: 1,
    fontSize: 12,
    lineHeight: 12,
  },
  unreadBadge: {
    backgroundColor: "#25D366",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ChatListItem;
