import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  BackHandler,
  Alert,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

// ✅ You can pass props or hardcode test values here
const TEST_ROOM_NAME = "demo-room-123";
const TEST_PATIENT_NAME = "Patient";

const JitsiPatientMeeting = ({
  roomName = TEST_ROOM_NAME,
  patientName = TEST_PATIENT_NAME,
}) => {
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ...(PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS
            ? [PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS]
            : []),
        ];

        for (const permission of permissions) {
          const result = await PermissionsAndroid.request(permission, {
            title: "Permission Required",
            message:
              "App needs access to your camera and microphone for video calls",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          });

          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            throw new Error("Required permissions were not granted");
          }
        }
        return true;
      } catch (err) {
        console.log("Permission error:", err);
        setError(err.message);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        setIsLoading(true);
        await requestPermissions();
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeMeeting();
  }, []);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (webViewRef.current) {
          Alert.alert("Leave Meeting", "Are you sure you want to leave?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Leave",
              onPress: () => {
                webViewRef.current?.injectJavaScript(
                  `api.executeCommand('hangup'); true;`
                );
                navigation.goBack();
              },
            },
          ]);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log("WebView error:", nativeEvent);
    setError("Failed to load meeting. Please check your internet connection.");
  };

  const handleWebViewMessage = (event) => {
    if (event.nativeEvent.data === "CALL_ENDED") {
      navigation.goBack();
    }
  };

  const audioConfigScript = `
    (function() {
      function initAudio() {
        if (window.jitsiApi) {
          
          // Configure Jitsi
          window.jitsiApi.executeCommand('setConfig', {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            prejoinPageEnabled: false,
            disableInitialGUM: false,
            enableNoAudioDetection: true,
            enableNoisyMicDetection: true,
            enableP2P: true,
            p2p: { enabled: true, useStunTurn: true }
          });

          // Set display name
          window.jitsiApi.executeCommand('displayName', '${patientName}');

          // Initialize audio
          try {
            window.jitsiApi.executeCommand('toggleAudio', true);
            
           

            // Add listeners
            window.jitsiApi.addListener('audioMuteStatusChanged', (data) => {
            });
            
            window.jitsiApi.addListener('audioAvailabilityChanged', (data) => {
            });

            // Check devices
            window.jitsiApi.executeCommand('getAvailableDevices', 'audioinput')
              .then(devices => console.log('Audio devices:', devices))
              .catch(err => console.log('Device error:', err));

          } catch (err) {
            console.log('Audio init error:', err);
          }
        }
      }

      // Try to init immediately
      initAudio();

      // Also try when API becomes available
      window.addEventListener('load', () => {
        const interval = setInterval(() => {
          if (window.jitsiApi) {
            initAudio();
            clearInterval(interval);
          }
        }, 500);
        setTimeout(() => clearInterval(interval), 10000);
      });
    })();
    true;
  `;

  const callEndScript = `
    window.addEventListener('load', () => {
      if (window.jitsiApi) {
        window.jitsiApi.addListener('videoConferenceLeft', () => {
          window.ReactNativeWebView.postMessage('CALL_ENDED');
        });
      }
    });
    true;
  `;

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setError(null)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Joining meeting...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: `https://meet.doc247.ca/${roomName}` }}
        style={styles.webview}
        onError={handleWebViewError}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        originWhitelist={["*"]}
        useWebKit={true}
        allowsFullscreenVideo={true}
        injectedJavaScript={audioConfigScript + callEndScript}
        onShouldStartLoadWithRequest={(request) =>
          request.url.startsWith("https://meet.doc247.ca/") ||
          request.url.startsWith("https://meet.jit.si/") ||
          request.url.includes("jitsi")
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default JitsiPatientMeeting;
