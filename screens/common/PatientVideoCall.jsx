import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function PatientVideoCall({ route }) {
  // Get dynamic room name and display name from route params or props
  // const { roomName = "DefaultRoom123", displayName = "Guest User" } = route.params || {};

  const roomName = "DefaultRoom123";
  const displayName = "Guest User";
  const moderator = true;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://meet.jit.si/external_api.js"></script>
      </head>
      <body style="margin:0;padding:0;overflow:hidden;">
        <div id="meet" style="width:100vw; height:100vh;"></div>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            const domain = "meet.jit.si"; // Use public Jitsi server or custom one
            const options = {
              roomName: "${roomName}",
              width: "100%",
              height: "100%",
              parentNode: document.querySelector('#meet'),
              userInfo: { displayName: "${displayName}" },
              configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
              },
              interfaceConfigOverwrite: {
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
              }
            };
            const api = new JitsiMeetExternalAPI(domain, options);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
