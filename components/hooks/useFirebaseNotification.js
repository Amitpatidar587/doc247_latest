import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  }
};

export const useFirebaseNotification = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      await requestNotificationPermission();
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
          setToken(fcmToken);
        } else {
          console.log('No FCM token received');
        }
      } catch (err) {
        console.error('Error getting FCM token:', err);
      }
    };

    fetchToken();
  }, []);

  return token;
};

