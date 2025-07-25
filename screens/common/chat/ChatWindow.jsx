import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import {
  createChat,
  fetchChatHistory,
} from "../../../redux/slices/app_common/utility/chatSlice";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { socket } from "../../../components/socket/socket";

const ChatWindow = ({ navigation }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef(null);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const { userId, userRole } = useSelector((state) => state.auth);
  const { selectedChatUser, history, pagination, loading } = useSelector(
    (state) => state.chat
  );

  // Constants
  const PAGE_SIZE = 10;

  // Memoized values
  const chatRoomId = useMemo(() => {
    if (!selectedChatUser) return null;
    return [selectedChatUser.sender_id, selectedChatUser.receiver_id]
      .sort()
      .join("_");
  }, [selectedChatUser?.sender_id, selectedChatUser?.receiver_id]);

  const chatPartner = useMemo(() => {
    if (!selectedChatUser) return null;
    return {
      id: selectedChatUser.receiver_id,
      name: selectedChatUser.receiver_name,
      avatar: selectedChatUser.receiver_image,
    };
  }, [selectedChatUser]);

  // Optimized scroll function with debouncing
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, []);

  // Memoized fetch function
  const fetchMessages = useCallback(
    async (targetPage = 1) => {
      if (!userId || !selectedChatUser) return;
      try {
        await dispatch(
          fetchChatHistory({
            user1_id: selectedChatUser.sender_id,
            user2_id: selectedChatUser.receiver_id,
            page: targetPage,
            page_size: PAGE_SIZE,
            append: targetPage > 1,
          })
        );

        if (targetPage < pagination?.total_pages) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.log("Error fetching history:", err);
      }
    },
    [
      dispatch,
      selectedChatUser?.sender_id,
      selectedChatUser?.receiver_id,
      userId,
    ]
  );

  // Socket connection effect - Clear messages when user changes
  useEffect(() => {
    if (!chatRoomId) return;

    // Clear messages when switching to a different user
    setMessages([]);
    setPage(1);

    socket.connect();
    socket.emit("joinRoom", { roomId: chatRoomId });

    return () => {
      socket.emit("leaveRoom", { roomId: chatRoomId });
      socket.disconnect();
    };
  }, [chatRoomId]);

  // Fetch messages effect - prevent double fetch on mount
  useEffect(() => {
    if (page === 1 && chatRoomId) {
      return;
    }
    if (page > 1) {
      fetchMessages(page);
    }
  }, [page, fetchMessages, chatRoomId]);

  // useEffect(() => {
  //   if (messages === null) return;
  //   setLoadingMore(false);
  // }, [scrollToBottom]);

  // Initial fetch when chatRoomId changes
  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(1);
    }
  }, [chatRoomId, fetchMessages]);

  // Format messages with memoization
  const formattedMessages = useMemo(() => {
    if (!history || !Array.isArray(history)) return [];

    return history.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      senderType: msg.sender_type,
      content: msg.message,
      timestamp: new Date(msg.created_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
  }, [history]);

  // Update messages effect - optimized with proper clearing
  useEffect(() => {
    if (formattedMessages.length === 0) return;

    setMessages((prev) => {
      // Always replace messages on page 1 (fresh load or user switch)
      if (page === 1) return formattedMessages;

      // For pagination, only add truly new messages
      const existingIds = new Set(prev.map((m) => m.id));
      const newMessages = formattedMessages.filter(
        (m) => !existingIds.has(m.id)
      );

      return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
    });
  }, [formattedMessages, page]);

  // Socket message handler
  const handleReceiveMessage = useCallback(
    (msg) => {
      if (userId === msg.senderId) return;

      const newMsg = {
        id: `${Date.now()}-${Math.random()}`, // More unique ID
        senderId: msg.senderId,
        senderType: msg.senderType,
        content: msg.content,
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setMessages((prev) => [newMsg, ...prev]);
      scrollToBottom();
    },
    [userId, scrollToBottom]
  );

  // Socket effect
  useEffect(() => {
    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [handleReceiveMessage]);

  // Send message handler - optimized
  const handleSendMessage = useCallback(async () => {
    const messageContent = newMessage.trim();
    if (!messageContent || !chatRoomId) return;

    setNewMessage("");

    const localMessage = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: userId,
      senderType: userRole,
      content: messageContent,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    // Optimistic update
    setMessages((prev) => [localMessage, ...prev]);
    scrollToBottom();

    try {
      // Send via socket and API in parallel
      const [socketPromise, apiPromise] = [
        new Promise((resolve) => {
          socket.emit("sendMessage", {
            chatRoomId,
            senderId: userId,
            senderType: userRole,
            content: messageContent,
          });
          resolve();
        }),
        dispatch(
          createChat({
            sender_id: selectedChatUser.sender_id,
            sender_type: userRole,
            receiver_id: selectedChatUser.receiver_id,
            receiver_type: selectedChatUser.receiver_type,
            message: messageContent,
            file_url: "",
            is_read: 1,
          })
        ),
      ];

      await Promise.all([socketPromise, apiPromise]);
    } catch (error) {
      console.log("Error sending message:", error);
      // Rollback on error
      setNewMessage(messageContent);
      setMessages((prev) => prev.filter((msg) => msg.id !== localMessage.id));
    }
  }, [
    newMessage,
    chatRoomId,
    userId,
    userRole,
    selectedChatUser,
    dispatch,
    scrollToBottom,
  ]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (
      !onEndReachedCalledDuringMomentum.current &&
      pagination &&
      page < pagination.total_pages &&
      !loading
    ) {
      setPage((prev) => prev + 1);
      onEndReachedCalledDuringMomentum.current = true;
      // setLoadingMore(true);
    }
  }, [pagination, page, loading]);

  // Memoized render functions
  const renderMessageItem = useCallback(
    ({ item }) => {
      const isYou = item.senderType === userRole;
      return (
        <View
          style={[
            styles.messageContainer,
            isYou ? styles.messageRight : styles.messageLeft,
          ]}
        >
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          <View
            style={[
              styles.messageBubble,
              isYou ? styles.bubbleRight : styles.bubbleLeft,
            ]}
          >
            <Text style={isYou ? styles.textRight : styles.textLeft}>
              {item.content}
            </Text>
          </View>
        </View>
      );
    },
    [userRole]
  );

  const keyExtractor = useCallback(
    (item, index) => (item?.id ? item.id.toString() : `key-${index}`),
    []
  );

  const ListFooterComponent = useMemo(() => {
    if (loading) {
      return <ActivityIndicator style={{ margin: 10 }} />;
    }

    if (!hasMore) {
      return (
        <Text style={{ textAlign: "center", padding: 10, color: "#888" }}>
          No more messages
        </Text>
      );
    }

    return null;
  }, [loading, hasMore]);

  const onMomentumScrollBegin = useCallback(() => {
    onEndReachedCalledDuringMomentum.current = false;
  }, []);

  // Header component
  const HeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        {chatPartner?.avatar ? (
          <Image source={{ uri: chatPartner.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.initialsContainer]}>
            <Text style={styles.initialsText}>
              {chatPartner?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.partnerName}>{chatPartner?.name}</Text>
      </View>
    ),
    [chatPartner, navigation]
  );

  if (!selectedChatUser || !chatPartner) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noChatText}>No chat selected</Text>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      {HeaderComponent}

      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={keyExtractor}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={ListFooterComponent}
        onMomentumScrollBegin={onMomentumScrollBegin}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={20}
        getItemLayout={(data, index) => ({
          length: 80, // Approximate item height
          offset: 80 * index,
          index,
        })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, { color: colors.primary }]}
          placeholder="Type a message"
          placeholderTextColor={colors.primary} 
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          multiline={false}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  // (same as your original styles)
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  noChatText: { fontSize: 16, color: "#888" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  partnerName: { fontWeight: "bold", fontSize: 16 },
  initialsContainer: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  initialsText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  messagesList: { padding: 10, flexGrow: 1 },
  messageContainer: { marginBottom: 10 },
  messageLeft: { alignSelf: "flex-start", alignItems: "flex-start" },
  messageRight: { alignSelf: "flex-end", alignItems: "flex-end" },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  bubbleLeft: { backgroundColor: "#f1f1f1" },
  bubbleRight: { backgroundColor: "#007bff" },
  textLeft: { color: "#000" },
  textRight: { color: "#fff" },
  timestamp: { fontSize: 10, color: "#888", marginTop: 2 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
});

export default ChatWindow;
