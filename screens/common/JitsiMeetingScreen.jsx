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
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../components/socket/socket.js";
import { selectedAppointment } from "../../redux/slices/app_common/AppointmentSlice.js";

const JitsiMeetingScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { state } = route.params;
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const webViewRef = useRef(null);
  const { userRole, userId } = useSelector((state) => state.auth);
  const { createAppointmentData } = useSelector((state) => state.appointment);
  const displayName = "rahul";

  // Request necessary permissions
  const appointmentId = state?.appointment_id;
  const checkPermissions = async () => {
    const cameraGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    const micGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
   
  };

  useEffect(() => {
    checkPermissions();
    socket.emit("videoCallJoined", {
        user_id: userId,
        appointment_id: appointmentId,
        from_user_id: state?.from_user_id,
        to_user_id: state?.to_user_id,
    });
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        // Request permissions in sequence to ensure proper initialization
        const cameraResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera for video calls",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (cameraResult !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error("Camera permission is required");
        }

        // Request audio permissions separately
        const audioResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone for audio calls",
            // buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (audioResult !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error("Microphone permission is required");
        }

        // Request audio settings permission if available
        if (PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS) {
          const audioSettingsResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
            {
              title: "Audio Settings Permission",
              message:
                "App needs access to modify audio settings for better call quality",
              // buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );

          if (audioSettingsResult !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn(
              "Audio settings permission not granted, but continuing..."
            );
          }
        }

        return true;
      } catch (err) {
        console.log("Permission error:", err);
        setError(err.message || "Required permissions were not granted");
        return false;
      }
    }
    return true; // For iOS, permissions are handled through Info.plist
  };

  // Function to handle meeting end with thank you screen
  const handleMeetingEnd = () => {
    setShowThankYou(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to handle okay button press
  const handleOkayPress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowThankYou(false);
      // Navigate to home screen

      const targetScreen = userRole === "patient" ? "Home" : "Session";
      socket.emit("videoCallLeft", {
          user_id: userId,
        appointment_id: appointmentId,
        from_user_id: state?.from_user_id,
        to_user_id: state?.to_user_id,
      });

      if (userRole === "doctor" && createAppointmentData?.id) {
        dispatch(
          selectedAppointment({
            id: createAppointmentData?.id,
            patient_id: createAppointmentData?.patient_id,
            doctor_id: createAppointmentData?.doctor_id,
          })
        );
      }

      navigation.reset({
        index: 0,
        routes: [{ name: targetScreen }],
      });
    });
  };

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (webViewRef.current) {
          Alert.alert(
            "Leave Meeting",
            "Are you sure you want to leave the meeting?",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Leave",
                onPress: () => {
                  // First end the meeting
                  webViewRef.current?.injectJavaScript(`
                    if (window.jitsiApi) {
                      window.jitsiApi.executeCommand('hangup');
                      window.ReactNativeWebView.postMessage('CALL_ENDED');
                    }
                    true;
                  `);
                  handleMeetingEnd();
                  return true;
                },
              },
            ]
          );
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  // Fetch JWT token and request permissions
  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        setIsLoading(true);
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        const tokenId = appointmentId;

        const res = await fetch(
          `https://api.doc247.ca/meet-token/?user=${encodeURIComponent(
            tokenId
          )}&moderator=true`
        );
        const json = await res.json();
        if (json?.token) {
          setToken(json.token);
        } else {
          throw new Error("Token not found in response");
        }
      } catch (err) {
        console.log("Error initializing meeting:", err);
        setError(err.message || "Failed to load meeting. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeMeeting();
  }, [userRole]);

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log("WebView error:", nativeEvent);
    // Add more detailed error logging
    if (nativeEvent.description) {
      console.log("Error description:", nativeEvent.description);
    }
    if (nativeEvent.url) {
      console.log("Error URL:", nativeEvent.url);
    }
    setError("Failed to load meeting. Please check your internet connection.");
  };
  const meetingStartedRef = useRef(false); // 👈 Add this at the top of your component

  const handleWebViewNavigationStateChange = (navState) => {
    const url = navState.url;

    // Allow the main Jitsi room to load
    if (url.includes(`/Room${RoomId}`)) {
      return true;
    }

    // Block only post-meeting pages
    if (
      url.includes("thankyou") ||
      url.includes("close.html") ||
      url.includes("leave") ||
      url.includes("rejoin")
    ) {
      console.warn("Blocked Jitsi post-meeting redirect:", url);
      webViewRef.current?.stopLoading();
      handleMeetingEnd();
      return false;
    }

    return true;
  };

  // Add call end handler script
  const handleCallEndScript = `
  function monitorForEndScreen() {
    const checkText = () => {
      const text = document.body?.innerText || "";
      if (text.includes("Start meeting again")) {
        window.ReactNativeWebView.postMessage('CALL_ENDED');
      }
    };
    setInterval(checkText, 1000); // Check every second
  }

  window.addEventListener('load', () => {
    if (window.jitsiApi) {
      window.jitsiApi.addListener('videoConferenceLeft', () => {
        window.ReactNativeWebView.postMessage('CALL_ENDED');
      });
      window.jitsiApi.addListener('hangup', () => {
        window.ReactNativeWebView.postMessage('CALL_ENDED');
      });
    }
    monitorForEndScreen();
  });
  true;
`;

  // Handle messages from WebView
  const handleWebViewMessage = (event) => {
    const data = event.nativeEvent.data;
    if (data === "CALL_ENDED") {
      handleMeetingEnd();
    }
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setToken(null);
            setIsLoading(true);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading || !token) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Joining meeting as Doctor...</Text>
      </View>
    );
  }

  const RoomId = appointmentId;

  const meetingUrl = `https://meet.doc247.ca/Room${RoomId}?jwt=${token}#config.prejoinPageEnabled=false&config.enableClosePage=false&interfaceConfig.ENABLE_CLOSE_PAGE=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableDeepLinking=true&interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true`;

  // Update the audio configuration script for better Android handling
  const bypassAppSelectionScript = `
    (function() {
      function initializeAudio() {
        if (window.jitsiApi) {
          // Log initial state
         

          // Android-specific configuration
          const isAndroid = '${Platform.OS}' === 'android';
          const config = {
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            disableInitialGUM: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableClosePage: false,
            enableWelcomePage: false,
            enableInsecureRoomNameWarning: false,
            enableNoAudioDetection: true,
            enableNoisyMicDetection: true,
            enableP2P: true,
            p2p: {
              enabled: true,
              preferH264: true,
              disableH264: false,
              useStunTurn: true
            },
            // Disable app selection and post-meeting screens
            disableDeepLinking: true,
            disableInitialGUM: false,
            enableClosePage: false,
            enableWelcomePage: false,
            enableInsecureRoomNameWarning: false,
            enableNoAudioDetection: true,
            enableNoisyMicDetection: true,
            enableP2P: true,
            p2p: {
              enabled: true,
              preferH264: true,
              disableH264: false,
              useStunTurn: true
            },
            // Android-specific audio settings
            ...(isAndroid && {
              audioQuality: {
                stereo: false,
                opusMaxAverageBitrate: 20000
              },
              disableAudioLevels: false,
              enableIceRestart: true,
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
              ],
              startAudioOnly: false,
              startWithAudioMuted: false,
              disableAudioLevels: false,
              enableIceRestart: true,
              // Force audio track
              constraints: {
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true
                }
              }
            })
          };

          // Apply configuration
          window.jitsiApi.executeCommand('setConfig', config);

          // Set display name
          window.jitsiApi.executeCommand('displayName', '${displayName}');

          // Initialize audio with retry mechanism for Android
          function initAudioWithRetry(retryCount = 0) {
            try {
              // Force audio initialization
              window.jitsiApi.executeCommand('toggleAudio', true);
              
              // Add audio state listeners
              window.jitsiApi.addListener('audioMuteStatusChanged', (data) => {
                if (isAndroid && data.muted) {
                  // Try to unmute if muted on Android
                  window.jitsiApi.executeCommand('toggleAudio', false);
                }
              });
              
              window.jitsiApi.addListener('audioAvailabilityChanged', (data) => {
                if (isAndroid && !data.available && retryCount < 3) {
                  // Retry audio initialization on Android
                  setTimeout(() => initAudioWithRetry(retryCount + 1), 1000);
                }
              });

              // Check available audio devices
              window.jitsiApi.executeCommand('getAvailableDevices', 'audioinput')
                .then(devices => {
                  if (isAndroid && devices.length === 0 && retryCount < 3) {
                    // Retry if no devices found on Android
                    setTimeout(() => initAudioWithRetry(retryCount + 1), 1000);
                  }
                })
                .catch(err => {
                  console.log('Error getting audio devices:', err);
                  if (isAndroid && retryCount < 3) {
                    setTimeout(() => initAudioWithRetry(retryCount + 1), 1000);
                  }
                });

            } catch (audioError) {
              console.log('Error initializing audio:', audioError);
              if (isAndroid && retryCount < 3) {
                setTimeout(() => initAudioWithRetry(retryCount + 1), 1000);
              }
            }
          }

          // Start audio initialization
          initAudioWithRetry();
          
          // Enable video
          window.jitsiApi.executeCommand('toggleVideo', true);

          // Add listener for meeting end
          window.jitsiApi.addListener('videoConferenceLeft', () => {
            window.ReactNativeWebView.postMessage('CALL_ENDED');
          });

          // Add listener for meeting failed
          window.jitsiApi.addListener('conferenceFailed', () => {
            window.ReactNativeWebView.postMessage('CALL_ENDED');
          });

          // Add listener for meeting ended
          window.jitsiApi.addListener('conferenceEnded', () => {
            window.ReactNativeWebView.postMessage('CALL_ENDED');
          });

          // Add listener for hangup button
          window.jitsiApi.addListener('hangup', () => {
            window.ReactNativeWebView.postMessage('CALL_ENDED');
          });
        }
      }

      // Try to initialize immediately if API is available
      initializeAudio();

      // Also set up a listener for when the API becomes available
      window.addEventListener('load', function() {
        const checkInterval = setInterval(() => {
          if (window.jitsiApi) {
            initializeAudio();
            clearInterval(checkInterval);
          }
        }, 500);

        // Clear interval after 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000);
      });
    })();
    true;
  `;

  // Jitsi configuration script
  const jitsiConfig = `
    window.addEventListener('load', () => {
      const config = {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        disableInitialGUM: false,
        enableClosePage: false,
        enableWelcomePage: false,
        enableInsecureRoomNameWarning: false,
        enableNoAudioDetection: true,
        enableNoisyMicDetection: true,
        enableP2P: true,
        p2p: {
          enabled: true,
          preferH264: true,
          disableH264: false,
          useStunTurn: true
        },
        resolution: 720,
        constraints: {
          video: {
            height: {
              ideal: 720,
              max: 720,
              min: 240
            }
          }
        },
        interfaceConfigOverwrite: {
          // Remove all branding
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          BRAND_WATERMARK_URL: '',
          JITSI_WATERMARK_LINK: '',
          JITSI_WATERMARK_URL: '',
          // Remove footer and prejoin branding
          SHOW_FOOTER: false,
          SHOW_PREJOIN_DISPLAY_NAME: false,
          SHOW_PREJOIN_HEADER: false,
          SHOW_PREJOIN_BRANDING: false,
          // Remove post-meeting screen
          ENABLE_POST_MEETING_SCREEN: false,
          // Additional branding removal
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'shortcuts', 'tileview', 'select-background', 'download', 'help',
            'mute-everyone', 'security'
          ],
          // Remove more branding elements
          DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
          DISABLE_PRESENCE_STATUS: true,
          DISABLE_RINGING: true,
          DISABLE_TRANSCRIPTION_SUBTITLES: true,
          DISABLE_VIDEO_BACKGROUND: true,
          DISABLE_WELCOME_PAGE: true,
          ENABLE_DIAL_OUT: false,
          ENABLE_PIP: false,
          ENABLE_RECORDING: false,
          ENABLE_REACTIONS: false,
          ENABLE_REMOTE_VIDEO_MENU: false,
          ENABLE_SHARE_BUTTON: false,
          ENABLE_TALK_WHILE_MUTED: false,
          ENABLE_TRANSCRIPTION: false,
          ENABLE_VIDEO_SHARE_BUTTON: false,
          FILM_STRIP_MAX_HEIGHT: 0,
          GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
          HIDE_DEEP_LINKING_LOGO: true,
          HIDE_INVITE_MORE_HEADER: true,
          INITIAL_TOOLBAR_TIMEOUT: 0,
          JITSI_WATERMARK_LINK: '',
          JITSI_WATERMARK_URL: '',
          LANG_DETECTION: false,
          MOBILE_APP_PROMO: false,
          NATIVE_APP_NAME: '',
          PROVIDER_NAME: '',
          RECENT_LIST_ENABLED: false,
          REMOTE_VIDEO_MENU_DISABLED: true,
          SETTINGS_SECTIONS: [],
          SHOW_BRAND_WATERMARK: false,
          SHOW_DEEP_LINKING_IMAGE: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_ALWAYS_VISIBLE: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'shortcuts', 'tileview', 'select-background', 'download', 'help',
            'mute-everyone', 'security'
          ],
          TOOLBAR_TIMEOUT: 0,
          VERTICAL_FILMSTRIP: false,
          VIDEO_LAYOUT_FIT: 'both',
          // Remove header
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          HIDE_INVITE_MORE_HEADER: true,
          SHOW_HEADER: false,
          // Remove footer
          SHOW_FOOTER: false,
          // Remove prejoin branding
          SHOW_PREJOIN_DISPLAY_NAME: false,
          SHOW_PREJOIN_HEADER: false,
          SHOW_PREJOIN_BRANDING: false,
          // Remove post-meeting screen
          ENABLE_POST_MEETING_SCREEN: false
        }
      };
      
      if (window.jitsiApi) {
        window.jitsiApi.executeCommand('setConfig', config);
      }
    });
    true;
  `;

  // Combine all scripts
  const combinedScript = `
(function() {
  const waitForJitsi = setInterval(() => {
    if (window.jitsiApi) {
      // ✅ Listen for end/hangup
      window.jitsiApi.addListener('videoConferenceLeft', () => {
        window.ReactNativeWebView.postMessage('CALL_ENDED');
      });

      window.jitsiApi.addListener('hangup', () => {
        window.ReactNativeWebView.postMessage('CALL_ENDED');
      });

      clearInterval(waitForJitsi);
    }
  }, 500);
})();
true;
`;

  // Thank you screen component
  const ThankYouScreen = () => (
    <Animated.View
      style={[
        styles.thankYouContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.thankYouContent}>
        <Text style={styles.thankYouTitle}>Thank You!</Text>
        <Text style={styles.thankYouMessage}>
          Your video consultation has ended.
        </Text>
        <TouchableOpacity style={styles.okayButton} onPress={handleOkayPress}>
          <Text style={styles.okayButtonText}>Okay</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: meetingUrl,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }}
        style={styles.webview}
        onError={handleWebViewError}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onMessage={handleWebViewMessage}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsFullscreenVideo={true}
        allowsBackForwardNavigationGestures={false}
        injectedJavaScript={combinedScript}
        // onShouldStartLoadWithRequest={(request) => {
        //   const disallowed =
        //     request.url.includes("thankyou") ||
        //     request.url.includes("close.html") ||
        //     request.url.includes("leave") ||
        //     request.url.includes("rejoin");

        //   if (disallowed) {
        //     console.warn("Blocked Jitsi redirect:", request.url);
        //     return false;
        //   }

        //   return true;
        // }}
        originWhitelist={["*"]}
        mixedContentMode="always"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        cacheEnabled={true}
        incognito={false}
      />
      {showThankYou && <ThankYouScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  webview: {
    flex: 1,
    backgroundColor: "#000",
    marginBottom: 40,
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
  thankYouContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  thankYouContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
  },
  thankYouTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 15,
  },
  thankYouMessage: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  okayButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  okayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default JitsiMeetingScreen;
