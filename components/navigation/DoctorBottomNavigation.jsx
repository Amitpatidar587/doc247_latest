import { StyleSheet, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme ,Text} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAnimatedStyle, withSpring } from "react-native-reanimated";

// Screens
import ProfileScreen from "../../screens/doctor/profile/ProfileScreen";
import PatientAppointmentScreen from "../../screens/patient/PatientAppointmentScreen";
import DoctorAvailability from "../../screens/doctor/profile/DoctorAvailability";
import Holiday from "../../screens/doctor/profile/Holiday";
import Reviews from "../Reviews";
import ChatListScreen from "../../screens/common/chat/Chatlist";
import ChatWindow from "../../screens/common/chat/ChatWindow";
import NotificationListScreen from "../../screens/common/notification/NotifcationList.jsx";
import SessionForm from "../../screens/doctor/session/SessionForm";
import { useSelector } from "react-redux";
import PatientInfo from "../../screens/doctor/patient-profile/PatientInfo.jsx";
import JitsiMeetingScreen from "../../screens/common/JitsiMeetingScreen";
const Tab = createBottomTabNavigator();

// Animated Tab Icon
const AnimatedTabIcon = ({ name, color, size, focused }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
  }));

  return (
    <View
      style={[
        animatedStyle,
        {
          justifyContent: "center",
          alignItems: "center",
          width: 60,
          height: 60,
          borderRadius: 50,
        },
      ]}
    >
      <MaterialCommunityIcons name={name} color={color} size={size} />
    </View>
  );
};

const DoctorBottomNavigation = () => {
  const { colors } = useTheme();
  // console.log(colors.primary);
  const { notificationsCount } = useSelector((state) => state.notification);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 60,
          position: "absolute",
          overflow: "hidden",
          elevation: 5,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#fff",
        tabBarActiveBackgroundColor: "#fff",
        tabBarItemStyle: {
          justifyContent: "space-between",
          margin: 0,
          width: 50,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
        headerStyle: {
          backgroundColor: colors.primary,
          height: 50,
        },
        headerTitleStyle: {
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: -40,
        },
      }}
    >
      {/* Visible Tabs */}
      <Tab.Screen
        name="Dashboard"
        component={PatientAppointmentScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="view-dashboard-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerShown: true,
          headerTitle: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Availability"
        component={DoctorAvailability}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="calendar-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Holiday"
        component={Holiday}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="pool"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerShown: true,
          title: "Holidays",
        }}
      />
      <Tab.Screen
        name="Reviews"
        component={Reviews}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="star-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerShown: true,
          title: "Reviews",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="chat-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerShown: true,
          title: "Chat",
        }}
      />
      {/* <Tab.Screen
        name="Notifications"
        component={NotificationListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: true,
        }}
      /> */}

      <Tab.Screen
        name="Notifications"
        component={NotificationListScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <View style={{ width: 24, height: 24, margin: 5 }}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  color={color}
                  size={size}
                />
                {notificationsCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {notificationsCount > 99 ? "99+" : notificationsCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
          headerShown: true,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="account-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          headerShown: true,
          title: "Profile",
        }}
      />

      {/* Hidden Screens (Previously in Stack) */}
      <Tab.Screen
        name="DoctorVideo"
        component={JitsiMeetingScreen}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ChatRoom"
        component={ChatWindow}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileDetails"
        component={PatientInfo}
        options={({ navigation }) => ({
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
          headerShown: true,
          headerTitle: "Profile Details",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 12, marginTop: -37 }}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen
        name="Session"
        component={SessionForm}
        options={{
          tabBarItemStyle: { display: "none" },
          // tabBarStyle: { display: "none" },
          headerShown: true,
          title: "Appointment Session",
          headerStyle: {
            backgroundColor: colors.primary,
            height: 70,
            // elevation: 2,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#fff",
            paddingBottom: 10,
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default DoctorBottomNavigation;
