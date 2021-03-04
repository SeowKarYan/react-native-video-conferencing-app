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
        <Icon name={`${ camera && 'camera' || 'camera-off'}`} size={30} onPress={turnCamera}/>
        <Icon name={`${ mic && 'microphone' || 'microphone-off'}`} size={30} onPress={turnMic}/>
        <Icon name={'camera-switch'} size={30} onPress={switchCamera} />
      </View>


    </View>

  );
}

export default InMeetingScreen;