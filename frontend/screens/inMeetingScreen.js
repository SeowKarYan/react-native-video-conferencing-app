import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [screen, setScreen] = useState(false);

  let switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  let turnCamera = () => {
    const videoTrack = localStream.getTracks().filter(track => track.kind === 'video')
    videoTrack[0].enabled = !videoTrack[0].enabled
    setCamera(videoTrack[0].enabled);
  };

  let turnMic = () => {
    const audioTrack = localStream.getTracks().filter(track => track.kind === 'audio')
    audioTrack[0].enabled = !audioTrack[0].enabled
    setMic(audioTrack[0].enabled);
  };

  let shareScreen = () => {
    setScreen(!screen);
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
      <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
        <Icon style={{ paddingHorizontal: 5 }} name={`${camera && 'camera' || 'camera-off'}`} size={30} onPress={turnCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${mic && 'microphone' || 'microphone-off'}`} size={30} onPress={turnMic} />
        <Icon style={{ paddingHorizontal: 5 }} name={'camera-switch'} size={30} onPress={switchCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${screen && 'arrow-down-bold-box' || 'arrow-up-bold-box'}`} size={30} onPress={shareScreen} />
      </View>
    </View>

  );
}

export default InMeetingScreen;