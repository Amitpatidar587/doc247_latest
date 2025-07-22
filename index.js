import {AppRegistry} from 'react-native';
import App from './App';
// import notifee, {AndroidImportance} from '@notifee/react-native';
import {name as appName} from './app.json';

// 🔧 Handle background/quit notifications


// Register app entry
AppRegistry.registerComponent(appName, () => App);
