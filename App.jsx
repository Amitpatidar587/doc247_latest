// Add this to the top of your App.js file or in a separate initialization file
import { LogBox } from "react-native";
// Ignore the specific warning
LogBox.ignoreLogs([
  "Possible Unhandled Promise Rejection",
  "[Violation] Added non-passive event listener",
]);
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, persistor } from "./redux/store";
import SplashScreen from "./screens/SplashScreen";
import RoleSelection from "./screens/RoleSelection";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import DoctorBottomNavigation from "./components/navigation/DoctorBottomNavigation";
import PatientBottomNavigation from "./components/navigation/PatientBottomNavigation";
import { lightTheme, darkTheme } from "./theme";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaView, StatusBar } from "react-native";
import AlertProvider from "./components/utility/AlertProvider";
// import PatientDashboard from "./screens/patient/Home/PatientDashboard";

const Stack = createStackNavigator();
const RootStack = createStackNavigator();
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import VideosCall from "./screens/common/VideosCall";
import useSocketJoin from "./components/socket/useSocketJoin";
import useVideoCallListener from "./components/socket/useVideoCallListener";
import { ToastProvider } from "./components/utility/Toast";
import IncomingCallModal from "./components/modals/IncomingCallModal";
import {
  acceptCall,
  hideCallModal,
  rejectCall,
} from "./redux/slices/app_common/utility/videoCallSlice";
import { socket } from "./components/socket/socket";
import { navigate, navigationRef } from "./navigationRef";
import { useFirebaseNotification } from "./components/hooks/useFirebaseNotification";
import { useCallback, useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { receiveCall } from "./redux/slices/app_common/utility/videoCallSlice.js";
import {
  fetchUnreadNotifications,
  SendNotification,
} from "./redux/slices/app_common/utility/notificationSlice.js";
// import ChangePasswordScreen from "./screens/auth/ChangePasswordScreen";

// Main Navigation Stack
function MainNavigator() {
  const { isLoggedIn, userRole, userId } = useSelector((state) => state.auth);
  // useNotifications();
  const {
    incomingCall,
    callStatus,
    showCallModal,
    isCaller,
    reason,
    receiverData,
    acceptedData,
  } = useSelector((state) => state.video);
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  useSocketJoin();
  useVideoCallListener();
  const token = useFirebaseNotification();
  useEffect(() => {
    if (token) {
      dispatch(
        SendNotification({
          token: token,
          user_id: userId,
          user_type: userRole,
        })
      );
    }
  }, [dispatch, token, userId, userRole]);

  const getNotificationCount = useCallback(() => {
    dispatch(
      fetchUnreadNotifications({
        action: "getUnreadCount",
        user_id: userId,
        user_type: userRole,
      })
    );
  }, [userId, dispatch]);

  useEffect(() => {
    getNotificationCount();
  }, [getNotificationCount]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage) {
        getNotificationCount();
      }

      console.log("📥 Message received:", remoteMessage);

      if (!remoteMessage?.data || remoteMessage?.data?.type !== "video_call") {
        console.warn("Received message without type:", remoteMessage);
        return;
      }

      if (remoteMessage?.data?.type === "video_call") {
        if (parseInt(remoteMessage?.data?.to_user_id) === userId) {
          useSocketJoin();
          dispatch(receiveCall(remoteMessage?.data));
        }
      }
    });

    // App opened from background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("App opened from background:", remoteMessage?.data);
      if (remoteMessage?.data?.type === "video_call") {
        if (parseInt(remoteMessage?.data?.to_user_id) === userId) {
          useSocketJoin();
          dispatch(receiveCall(remoteMessage?.data));
        }
      }
    });

    // App opened from quit (cold start)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log("App opened from quit (cold start):", remoteMessage);
        if (remoteMessage?.data?.type === "video_call") {
          if (parseInt(remoteMessage?.data?.to_user_id) === userId) {
            useSocketJoin();
            dispatch(receiveCall(remoteMessage?.data));
          }
        }
      });

    return unsubscribe;
  }, [dispatch]);

  const handleAccept = () => {
    const data = {
      to_user_id: incomingCall?.from_user_id,
      to_user_type: incomingCall?.from_user_type,
      from_user_type: incomingCall?.to_user_type,
      from_user_id: incomingCall?.to_user_id,
      appointment_id: Math.floor(Math.random() * 900) + 100,
    };
    socket.emit("callAccepted", data);
    dispatch(acceptCall());
    navigate("DoctorVideo", { state: data });
  };

  const handleReject = () => {
    console.log("handleReject", receiverData);
    socket.emit("callRejected", {
      to_user_id: incomingCall?.from_user_id || receiverData?.to_user_id,
      to_user_type: incomingCall?.from_user_type || receiverData?.to_user_type,
      from_user_type:
        incomingCall?.to_user_type || receiverData?.from_user_type,
      from_user_id: incomingCall?.to_user_id || receiverData?.from_user_id,
      reason: "Call declined",
    });
    dispatch(rejectCall());
    setTimeout(() => dispatch(hideCallModal()), 2000);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0474ed",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            userRole === "patient" ? (
              <RootStack.Screen
                name="home"
                component={PatientBottomNavigation}
              />
            ) : (
              <RootStack.Screen
                name="DoctorTabs"
                component={DoctorBottomNavigation}
              />
            )
          ) : (
            <RootStack.Screen name="Auth">
              {() => (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Splash" component={SplashScreen} />
                  <Stack.Screen
                    name="RoleSelection"
                    component={RoleSelection}
                  />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Signup" component={SignupScreen} />
                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
                  />
                  <Stack.Screen
                    name="reset_password"
                    component={ResetPasswordScreen}
                  />
                  <Stack.Screen name="video" component={VideosCall} />
                  {/* <Stack.Screen
                    name="ChangePassword"
                    component={ChangePasswordScreen}
                  /> */}
                </Stack.Navigator>
              )}
            </RootStack.Screen>
          )}
        </RootStack.Navigator>
        <IncomingCallModal
          incomingCall={incomingCall}
          callStatus={callStatus}
          show={showCallModal}
          onAccept={handleAccept}
          onReject={handleReject}
          onClose={() => dispatch(hideCallModal())}
          isCaller={isCaller}
          userRole={userRole}
          reason={reason}
          receiverData={receiverData}
          acceptedData={acceptedData}
        />
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  const isDarkMode = false;
  return (
    <Provider store={store}>
      <AlertProvider>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
              <ToastProvider>
                <MainNavigator />
              </ToastProvider>
            </PaperProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </AlertProvider>
    </Provider>
  );
}
