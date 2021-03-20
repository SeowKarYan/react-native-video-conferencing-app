import React, { useState, useEffect } from 'react';
import { Text, View, } from 'react-native';
//import Peer from 'react-native-peerjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import {
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';

const InMeetingScreen = ({ route, navigation }) => {
  const { localStream, remoteStream, roomID, otherUserID, peer, username } = route.params;
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [screen, setScreen] = useState(false);
  const [otherStream, setOtherStream] = useState();
  const [myStream, setMyStream] = useState();
  const [myPeer, setMyPeer] = useState();

  useEffect(() => {
    setMyStream(localStream);
    setMyPeer(peer);
  }, [])

  useEffect(() => {
    setOtherStream(remoteStream);
  }, [remoteStream])

  // connect to peer server
  /*
  let peerConnection = () => {
    const myPeer = new Peer(undefined, {
      host: '192.168.1.108',
      secure: false,
      port: '3001',
      path: '/',
    });

    return myPeer;
  }*/

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

    //const myPeer = peerConnection();

    if (screen === false) {

      startService();
      setScreen(!screen);

      mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
        },
        audio: false
      }).then((stream) => {
        setMyStream(stream);
        myPeer.call(otherUserID, stream);

      }).catch((error) => {
        console.log(error);
      })

    } else {
      setScreen(!screen);
      setMyStream(localStream);
      stopService();
      myPeer.call(otherUserID, localStream);
    }
  }

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
        <View style={{ flexDirection: 'row', }}>
          {myStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
            streamURL={myStream.toURL()}
          />}
          {otherStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
            streamURL={otherStream.toURL()}
          />}
        </View>
      </View>
      <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
        <Icon style={{ paddingHorizontal: 5 }} name={`${camera && 'camera' || 'camera-off'}`} size={30} onPress={turnCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${mic && 'microphone' || 'microphone-off'}`} size={30} onPress={turnMic} />
        <Icon style={{ paddingHorizontal: 5 }} name={'camera-switch'} size={30} onPress={switchCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${screen && 'arrow-down-bold-box' || 'arrow-up-bold-box'}`} size={30} onPress={shareScreen} />
        <Icon style={{ paddingHorizontal: 5 }} name={`comment-text-multiple`} size={30} onPress={() => navigation.navigate('MeetingChat',{username: username})} />
        <Icon style={{ paddingHorizontal: 5 }} name={`notebook`} size={30} onPress={() => navigation.navigate('MeetingNote')} />
      </View>
    </View>

  );
}

export default InMeetingScreen;