import messaging from '@react-native-firebase/messaging';
import {socket} from './src/socket/socket';
import {receiveCall} from './src/redux/slices/app_common/utility/videoCallSlice';
import store from './src/redux/store';

const handleVideoCallFCM = async data => {
  const {type} = data;
  if (type === 'video_call') {
    // Step 1: Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // Step 3: Dispatch Redux to show modal
    // store.dispatch(receiveCall({...data}));
  }
};
