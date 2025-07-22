import { useState, useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const useGeolocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 10000,
    distanceFilter = 10,
    interval = 5000,
    fastestInterval = 2000,
  } = options;

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const watchId = useRef(null);

  // Request permission function
  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return false;
  };

  // Get current position
  const getCurrentPosition = async () => {
    const hasPermission = await requestPermission();
    
    if (!hasPermission) {
      setError('Location permission denied');
      return;
    }

    setIsLoading(true);
    setError(null);

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
        showLocationDialog: true,
        forceRequestLocation: true,
      }
    );
  };

  // Start watching position
  const startTracking = async () => {
    const hasPermission = await requestPermission();
    
    if (!hasPermission) {
      setError('Location permission denied');
      return;
    }

    setIsTracking(true);
    setError(null);

    watchId.current = Geolocation.watchPosition(
      (position) => {
        setLocation(position);
      },
      (err) => {
        setError(err.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy,
        distanceFilter,
        interval,
        fastestInterval,
        showLocationDialog: true,
        forceRequestLocation: true,
      }
    );
  };

  // Stop watching position
  const stopTracking = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setIsTracking(false);
    }
  };

  // Clear location data
  const clearLocation = () => {
    setLocation(null);
    setError(null);
    if (isTracking) {
      stopTracking();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return {
    location,
    error,
    isLoading,
    isTracking,
    getCurrentPosition,
    startTracking,
    stopTracking,
    clearLocation,
  };
};

export default useGeolocation;