/* eslint-disable react/no-unstable-nested-components */
// Patient's Bottom Tab Navigation

import { createStackNavigator } from "@react-navigation/stack";
import DoctorSearch from "../../screens/patient/Home/DoctorSearch";
import PatientAppointmentScreen from "../../screens/patient/PatientAppointmentScreen";
import PatientProfileScreen from "../../screens/patient/PatientProfile";
import { useTheme } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PatientHome from "../../screens/patient/Home/Home";
import Reviews from "../Reviews";
import Order from "../../screens/patient/Screens/Order";
import BookAppointmentScreen from "../../screens/patient/BookAppointmentScreen";
import ConfirmationScreen from "../../screens/patient/ConfirmationScreen";
import ChatListScreen from "../../screens/common/chat/Chatlist";
import ChatWindow from "../../screens/common/chat/ChatWindow";
import HealthIdCheck from "../../screens/patient/HealthIdCheck";
import DoctorProfile from "../../screens/doctor/profile2/DoctorProfile";
// import { CommonActions } from "@react-navigation/native";
// import Favorite from "../../screens/patient/Screens/Favorite";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NotificationListScreen from "../../screens/common/notification/NotifcationList.jsx";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import JitsiMeetingScreen from "../../screens/common/JitsiMeetingScreen.jsx";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BookStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          height: 60,
          elevation: 2,
          shadowOpacity: 0,
          backgroundColor: "#0474ed",
        },
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: "600",
          marginTop: -30,
          color: "#fff",
        },
        headerLeftContainerStyle: {
          marginLeft: -10,
          paddingLeft: 0,
          marginTop: -30,
        },
        headerRightContainerStyle: {
          // paddingRight: 10,
          marginTop: -30,
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="HealthCheck"
        component={HealthIdCheck}
        // options={{
        //   headerShown: true,
        //   headerStyle: {
        //     height: 60,
        //     elevation: 2,
        //     shadowOpacity: 0,
        //     backgroundColor: "#0474ed",
        //   },
        //   headerTitleStyle: {
        //     fontSize: 16,
        //     fontWeight: "600",
        //     marginTop: -30,
        //     color: "#fff",
        //   },
        //   headerLeftContainerStyle: {
        //     marginLeft: -10,
        //     paddingLeft: 0,
        //     marginTop: -30,
        //   },
        //   headerRightContainerStyle: {
        //     // paddingRight: 10,
        //     marginTop: -30,
        //   },
        //   headerTintColor: "#fff",
        // }}
      />
      <Stack.Screen
        name="Book"
        component={BookAppointmentScreen}
        // options={{
        //   headerShown: true,
        //   headerStyle: {
        //     height: 40,
        //     elevation: 2,
        //     shadowOpacity: 0,
        //   },
        //   headerTitleStyle: {
        //     fontSize: 16,
        //     fontWeight: "600",
        //     marginTop: -30,
        //   },
        //   headerLeftContainerStyle: {
        //     marginTop: -30,
        //   },
        //   headerRightContainerStyle: {
        //     marginTop: -30,
        //   },
        // }}
      />

      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        // options={{
        //   headerShown: false,
        //   headerStyle: {
        //     height: 45,
        //     elevation: 0,
        //     shadowOpacity: 0,
        //   },
        //   headerTitleStyle: {
        //     fontSize: 16,
        //     fontWeight: "600",
        //     marginTop: -30,
        //   },
        //   headerLeftContainerStyle: {
        //     paddingLeft: 10,
        //     marginTop: -30,
        //   },
        //   headerRightContainerStyle: {
        //     paddingRight: 10,
        //     marginTop: -30,
        //   },
        // }}
      />
    </Stack.Navigator>
  );
}

const PatientHomeStack = createStackNavigator();

function PatientHomeStackScreen({ navigation }) {
  // const navigateToHome = () => {
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [{ name: "PatientHomeMain" }],
  //     })
  //   );
  // };

  return (
    <PatientHomeStack.Navigator
      initialRouteName="PatientHomeMain"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#0474ed",
          height: 45,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: "600",
          marginTop: -30,
          color: "#fff",
        },
        headerLeftContainerStyle: {
          paddingLeft: 10,
          marginTop: -30,
        },
        headerRightContainerStyle: {
          paddingRight: 10,
          marginTop: -30,
        },
      }}
    >
      <PatientHomeStack.Screen name="PatientHomeMain" component={PatientHome} />
      <PatientHomeStack.Screen name="Search" component={DoctorSearch} />
      <PatientHomeStack.Screen name="BookScreen" component={BookStack} />
      {/* <PatientHomeStack.Screen
        name="PatientVideo"
        component={JitsiPatientMeeting}
        options={{
          headerShown: false,
          presentation: "modal",
          tabBarStyle: { display: "none" },
        }}
      /> */}
      <PatientHomeStack.Screen
        name="Profile"
        component={PatientProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            marginTop: -30,
            color: "#fff",
          },
        }}
      />
      <PatientHomeStack.Screen
        name="DoctorProfile"
        component={DoctorProfile}
        options={{
          headerShown: true,
          headerTitle: "Doctor Profile",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
            marginTop: -30,
            color: "#fff",
          },
        }}
      />
      <PatientHomeStack.Screen name="Review" component={Reviews} />
    </PatientHomeStack.Navigator>
  );
}

const PatientBottomNavigation = () => {
  // Stack for Booking
  const { colors } = useTheme();

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
      <Tab.Screen
        name="Home"
        component={PatientHomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      {/* Hide Book Tab */}
      <Tab.Screen
        name="BookTab"
        component={BookStack}
        options={{
          tabBarItemStyle: { display: "none" }, // Hides the tab
          headerShown: false,
          tabBarLabel: "Book",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={50}
              color="blue"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={PatientAppointmentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Order"
        component={Order}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: true,
          title: "Orders",
        }}
      />

      <Tab.Screen
        name="ProfileDetails"
        component={DoctorProfile}
        options={({ navigation }) => ({
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
          headerShown: true,
          headerTitle: "Profile Details",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 12, marginTop: -35 }}
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
      {/* <Tab.Screen
        name="Call"
        component={VideosCall}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="video"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="DoctorVideo"
        component={JitsiMeetingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="contacts-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ChatRoom"
        component={ChatWindow}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="chat-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          tabBarItemStyle: { display: "none" },
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="chat-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          // tabBarItemStyle: { display: "none" },
          headerShown: true,
          headerTitle: "Chat History",
          // tabBarStyle: { display: "none" },
        }}
      />
      {/* <Tab.Screen
        name="Notifications"
        component={NotificationListScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
          // tabBarItemStyle: { display: "none" },
          headerShown: true,
          // tabBarStyle: { display: "none" },
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
        component={PatientProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      /> */}
      {/* <Tab.Screen
        name="Favourites"
        component={Favorite}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-outline"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      /> */}
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

export default PatientBottomNavigation;
