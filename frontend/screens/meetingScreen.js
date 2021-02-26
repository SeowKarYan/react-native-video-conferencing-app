import React, { useState, useEffect } from 'react';
import { TextInput, View, Button, StyleSheet, Text } from 'react-native';
import io from "socket.io-client";
import Peer from 'react-native-peerjs';
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

const socket = io("http://192.168.1.111:3000");

const MeetingScreen = ({ navigation }) => {

  const [meetingcode, setMeetingcode] = useState('');
  const [userID, setUserID] = useState('');
  const [stream, setStream] = useState();

  useEffect(() => {
    getStream();
  }, [])

  let peerConnection = () => {
    const myPeer = new Peer(undefined, {
      host: '192.168.1.111',
      secure: false,
      port: '3001',
      path: '/',
    });

    return myPeer;
  }

  let generateRoomID = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

  let getStream = () => {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: (isFront ? "user" : "environment"),
          deviceId: videoSourceId
        }
      })
        .then(stream => {
          setStream(stream);
          console.log(stream);
        })
        .catch(error => {
          // Log error
        });
    });
  }

  let createMeeting = () => {

    const myPeer = peerConnection();

    const roomID = generateRoomID();
    setMeetingcode(roomID);

    myPeer.on('open', id => {
      setUserID(id);
      socket.emit('joinRoom', roomID, id)
    })

    socket.on('userConnected', (userID) => {
      console.log(userID)
    })
    
    //navigation.navigate('InMeeting');
  }

  let joinMeeting = () => {

    socket.emit('joinRoom', meetingcode, userID)
    socket.on('userConnected', (userID) => {
      console.log(userID)
    })

    //navigation.navigate('InMeeting');
  }

  return (
    <View>
      <View style={{ paddingVertical: 50, marginHorizontal: 20, }}>
        <Button title="Create Meeting" onPress={createMeeting} />
        <Text>userID:{userID}</Text>
      </View>

      <View style={{ marginHorizontal: 20, }}>
        <TextInput style={{ paddingBottom: 20 }} placeholder="Please enter meeting code" onChangeText={text => setMeetingcode(text)} value={meetingcode} />
        <Button title="Join Meeting" onPress={joinMeeting} />
      </View>
      <View>
        <RTCView
          streamURL={stream && stream.toURL()}
        />
      </View>
    </View>

  );
}

export default MeetingScreen;