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
  const { localStream,remoteStream } = route.params;

  return (
    <View>
        {localStream && <RTCView style={{width: 200, height:200, borderColor: "red",backgroundColor: "black"}}
          streamURL={localStream.toURL()}
        />}
        {remoteStream && <RTCView style={{width: 200, height:200, borderColor: "red",backgroundColor: "black"}}
          streamURL={remoteStream.toURL()}
        />}
      </View>
      
  );
}

export default InMeetingScreen;