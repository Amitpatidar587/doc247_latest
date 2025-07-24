import React, {useEffect} from 'react';
import {
  View,

  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import JitsiMeet, {JitsiMeetView} from 'react-native-jitsi-meet';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';

const JitsiDoctorMeeting = ({route}) => {
  const navigation = useNavigation();
  const {userRole} = useSelector(state => state.auth);
  const {state} = route.params || {};
  const [setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenAndStartMeeting = async () => {
      try {
        const res = await fetch(
          `https://api.doc247.ca/meet-token/?user=${encodeURIComponent(
            state.fromUserId,
          )}&moderator=true`,
        );
        const json = await res.json();

        if (json?.token) {
          setToken(json.token);

          const url = `https://meet.doc247.ca/Room${state.appointment_id}`;
          const userInfo = {
            displayName: 'Doctor',
            email: 'doctor@example.com',
            avatar: '', // optional
          };

          setTimeout(() => {
            JitsiMeet.call(url, userInfo, json.token);
          }, 1000);
        } else {
          throw new Error('Token not found');
        }
      } catch (e) {
        Alert.alert('Error', e.message || 'Could not start meeting');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndStartMeeting();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert('Leave Meeting', 'Are you sure you want to leave?', [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Leave',
            onPress: () => {
              JitsiMeet.endCall();
              const targetScreen =
                userRole === 'patient' ? 'Home' : 'Dashboard';
              navigation.reset({index: 0, routes: [{name: targetScreen}]});
             
              
            },
          },
        ]);
        return true;
      },
    );

    return () => {
      JitsiMeet.endCall();
      backHandler.remove();
    };
  }, [
    navigation,
    route.params,
    userRole,
    state.fromUserId,
    state.appointment_id,
    setToken,
  ]);

  const onConferenceTerminated = () => {
    const targetScreen = userRole === 'patient' ? 'Home' : 'Dashboard';
    navigation.reset({index: 0, routes: [{name: targetScreen}]});
    // console.log("targetScreen", targetScreen);
    // navigation.navigate("Splash");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Joining meeting as Doctor...</Text>
      </View>
    );
  }

  return (
    <JitsiMeetView
      onConferenceTerminated={onConferenceTerminated}
      style={{flex: 1}}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default JitsiDoctorMeeting;
