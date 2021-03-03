import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
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

const InMeetingScreen = ({ route, navigation }) => {
  const { localStream, remoteStream, roomID } = route.params;

  let switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  return (
    <View>
      <Text style={{ paddingHorizontal: 90, paddingVertical: 10 }}>Room ID: {roomID}</Text>
      {localStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
        streamURL={localStream.toURL()}
      />}
      {remoteStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
        streamURL={remoteStream.toURL()}
      />}
      <View style={{ marginHorizontal: 20, marginTop: 10}}>
        <Button title="Switch camera" onPress={switchCamera} />
      </View>
    </View>

  );
}

export default InMeetingScreen;