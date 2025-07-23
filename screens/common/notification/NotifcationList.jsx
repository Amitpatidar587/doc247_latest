import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import NotificationListItem from "./NotificationListItem.jsx";
import {
  fetchAllNotifications,
  fetchUnreadNotifications,
  updateNotification,
} from "../../../redux/slices/app_common/utility/notificationSlice.js";
import { navigate } from "../../../navigationRef.js";

const NotificationListScreen = () => {
  const dispatch = useDispatch();
  const { userRole, userId } = useSelector((s) => s.auth);
  const { notifications, loading, pagination, notificationsCount } =
    useSelector((s) => s.notification);


  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // remember the previous count
  const prevCountRef = useRef(notificationsCount);

  const loadPage = useCallback(
    (p = 1) =>
      dispatch(
        fetchAllNotifications({
          action: "getNotificationData",
          user_id: userId,
          user_type: userRole,
          page: p,
          page_size: 10,
          append: p > 1,
        })
      ),
    [dispatch, userId, userRole]
  );

  // when you mount, load page 1 + unread count
  useEffect(() => {
    setPage(1);
    loadPage(1);
    dispatch(
      fetchUnreadNotifications({
        action: "getUnreadCount",
        user_id: userId,
      })
    );
  }, [dispatch, loadPage, userId]);

  // if notificationsCount changes, reload page 1
  useEffect(() => {
    if (prevCountRef.current !== notificationsCount) {
      setPage(1);
      loadPage(1);
    }
    prevCountRef.current = notificationsCount;
  }, [notificationsCount, loadPage]);

  // pagination
  useEffect(() => {
    if (page > 1) loadPage(page);
  }, [page, loadPage]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadPage(1);
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (!loading && pagination?.current_page < pagination?.total_pages) {
      setPage((p) => p + 1);
    }
  };

  const handlePress = (item) => {
    if (item.is_read === 0) {
      dispatch(updateNotification({ id: item.id, is_read: 1 }));
      dispatch(
        fetchUnreadNotifications({
          action: "getUnreadCount",
          user_id: userId,
          user_type: userRole,
        })
      );
    }
    if (item.notify_type === "appointment") {
      const screen = userRole === "patient" ? "Appointments" : "Dashboard";
      navigate(screen, { status: item?.status || "pending" });
    } else if (item.notify_type === "review") {
      navigate("Reviews");
    } else if (item.notify_type === "Order") {
      navigate("Order");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingBottom: 65 }}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : `key-${index}`
        }
        renderItem={({ item }) => (
          <NotificationListItem
            notification={item}
            onPress={() => handlePress(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator style={{ margin: 10 }} />
          ) : null
        }
        ListEmptyComponent={() =>
          !loading && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                minHeight: "100%",
                justifyContent: "center",
                paddingBottom: 30,
              }}
            >
              <Text style={{ color: "gray", fontWeight: "bold", fontSize: 18 }}>
                No notifications
              </Text>
            </View>
          )
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

export default NotificationListScreen;
