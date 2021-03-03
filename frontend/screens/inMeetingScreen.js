import React from 'react';
import { StyleSheet, Text,View } from 'react-native';
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
  const { localStream, remoteStream, roomID } = route.params;

  return (
    <View>
      <Text style={{paddingHorizontal: 90, paddingVertical:10}}>Room ID: {roomID}</Text>
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