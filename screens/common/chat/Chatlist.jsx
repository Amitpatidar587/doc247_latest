import React, { useState, useCallback, useEffect } from "react";
import { FlatList, Text, View, RefreshControl } from "react-native";
import ChatListItem from "./ChatListItem";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  fetchLastChats,
  selectedChatUser,
} from "../../../redux/slices/app_common/utility/chatSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { senderId, userRole } = useSelector((state) => state.auth);
  const { chatUsers, unread_count } = useSelector((state) => state.chat);

  const [refreshing, setRefreshing] = useState(false);

  const getChatList = useCallback(() => {
    return dispatch(
      fetchLastChats({
        action: "last_message",
        user_id: senderId,
        user_type: userRole,
      })
    );
  }, [dispatch, senderId, userRole]);

  // Initial load
  useEffect(() => {
    getChatList();
  }, [getChatList]);

  // Also reload whenever this screen is focused
  useFocusEffect(
    useCallback(() => {
      getChatList();
    }, [getChatList])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getChatList();
    setRefreshing(false);
  }, [getChatList]);

  const handleChatPress = (chat) => {
    const isSender = chat.sender_id === senderId;
    const payload = {
      sender_id: senderId,
      sender_type: userRole,
      receiver_id: isSender ? chat.receiver_id : chat.sender_id,
      receiver_name: isSender ? chat.receiver_name : chat.sender_name,
      receiver_image: isSender
        ? chat.receiver_profile_image
        : chat.sender_profile_image,
      receiver_type: isSender ? chat.receiver_type : chat.sender_type,
    };

    dispatch(selectedChatUser(payload));
    navigation.navigate("ChatRoom");
  };

  return (
    <View style={{ flex: 1, paddingBottom: 65, backgroundColor: "#fff" }}>
      <FlatList
        data={chatUsers}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            key={item.id}
            unread_count={unread_count}
            onPress={() => handleChatPress(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 60, flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
              zIndex: 1,
              paddingBottom: 30
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "gray" }}>
              No Chats
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ChatListScreen;
