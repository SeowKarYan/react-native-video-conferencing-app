import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import {
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';

const InMeetingScreen = ({ route, navigation }) => {
  const { localStream, remoteStream, roomID } = route.params;
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [screen, setScreen] = useState(false);
  const [screenShare, setScreenShare] = useState();

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

    mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
      },
      audio: false
    }).then((stream) => {
      console.log("share screen:" + stream);
      setScreenShare(stream);
    }).catch((error) => {
      console.log(error);
    })
  };

  async function startService() {

    const channelConfig = {
      id: 'ForegroundServiceChannel',
      name: 'Notification Channel',
    };
    await VIForegroundService.createNotificationChannel(channelConfig);

    const notificationConfig = {
      id: 3456,
      title: 'Foreground Service',
      text: 'Foreground service is running',
      icon: 'ic_notification',
    };
    notificationConfig.channelId = 'ForegroundServiceChannel';

    await VIForegroundService.startService(notificationConfig);
  };

  async function stopService() {
    await VIForegroundService.stopService();
  }

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
        {screenShare && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
          streamURL={screenShare.toURL()}
        />}
      </View>
      <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
        <Icon style={{ paddingHorizontal: 5 }} name={`${camera && 'camera' || 'camera-off'}`} size={30} onPress={turnCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${mic && 'microphone' || 'microphone-off'}`} size={30} onPress={turnMic} />
        <Icon style={{ paddingHorizontal: 5 }} name={'camera-switch'} size={30} onPress={switchCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${screen && 'arrow-down-bold-box' || 'arrow-up-bold-box'}`} size={30} onPress={shareScreen} />
      </View>
      <Button title="Start foreground service" onPress={startService} />
      <Button title="Stop foreground service" onPress={stopService} />
    </View>

  );
}

export default InMeetingScreen;