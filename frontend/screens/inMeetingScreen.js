import React from 'react';
import { Text,View } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

const InMeetingScreen = ({route, navigation}) => {
  const { localStream } = route.params;

  return (
    <View>
        <RTCView style={{width: 200, height:200, borderColor: "red",backgroundColor: "black"}}
          streamURL={localStream && localStream.toURL()}
        />
      </View>
  );
}

export default InMeetingScreen;