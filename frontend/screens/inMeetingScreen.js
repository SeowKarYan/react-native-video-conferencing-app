import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
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
      <View>
        <Text style={{ paddingHorizontal: 90, paddingVertical: 10 }}>Room ID: {roomID}</Text>
        {localStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
          streamURL={localStream.toURL()}
        />}
        {remoteStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
          streamURL={remoteStream.toURL()}
        />}
      </View>
      <View style={{ marginHorizontal: 20, marginTop: 10 }}>
        <MaterialIcon name={'flip-camera-ios'} size={30} onPress={switchCamera} />
      </View>


    </View>

  );
}

export default InMeetingScreen;