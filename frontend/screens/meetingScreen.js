import React, { useState, useEffect } from 'react';
import { TextInput, View, Button, StyleSheet, Text } from 'react-native';
import io from "socket.io-client";
import Peer from 'react-native-peerjs';
import {
  mediaDevices,
} from 'react-native-webrtc';

// connect to server
const socket = io("http://192.168.1.104:3000");

const MeetingScreen = ({ navigation }) => {

  const [meetingcode, setMeetingcode] = useState('');
  const [userID, setUserID] = useState('');
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [otherUserID, setOtherUserID] = useState();
  /*
    useEffect(() => {
     
    }, [])*/

  // connect to peer server
  let peerConnection = () => {
    const myPeer = new Peer(undefined, {
      host: '192.168.1.104',
      secure: false,
      port: '3001',
      path: '/',
    });

    return myPeer;
  }

  let generateRoomID = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

  let createMeeting = () => {

    const myPeer = peerConnection();

    const roomID = generateRoomID();
    setMeetingcode(roomID);

    myPeer.on('open', id => {
      setUserID(id);
      socket.emit('join-room', roomID, id)
    })

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
          console.log("Local stream:" + stream);
          setLocalStream(stream);
          navigation.navigate('InMeeting', {
            localStream: stream,
            roomID: roomID,
          });
          socket.on('userConnected', (userID) => {
            setOtherUserID(userID);
            const call = myPeer.call(userID, stream);
            call.on('stream', userVideoStream => {
              setRemoteStream(userVideoStream);
              navigation.navigate('InMeeting', {
                remoteStream: userVideoStream,
                otherUserID: userID
                //currentPeer: call.peerConnection
              });
            })
            /*
            socket.on('getSharedStream',stream => {
              console.log('get shared stream:' + stream);
              call.peerConnection.getSenders()[1].replaceTrack(stream);
              
              navigation.navigate('InMeeting', {
                //remoteStream: stream,
                //shareStream: stream,
              });
            })*/

            call.on('close', () => {
              setRemoteStream(null);
              navigation.navigate('InMeeting', {
                remoteStream: null,
              });
            })
          })
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  let joinMeeting = () => {

    const myPeer = peerConnection();

    myPeer.on('open', id => {
      setUserID(id);
      socket.emit('join-room', meetingcode, id)
    })

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
          setLocalStream(stream);
          myPeer.on('call', call => {
            call.answer(stream);
            call.on('stream', userVideoStream => {
              setRemoteStream(userVideoStream);
              navigation.navigate('InMeeting', {
                localStream: stream,
                remoteStream: userVideoStream,
                roomID: meetingcode,
                //otherUserID: call.peer.id,
                //currentPeer: call.peerConnection
              });
            })
            call.on('close', () => {
              setRemoteStream(null);
              navigation.navigate('InMeeting', {
                remoteStream: null,
              });
            })
          })
        })
        .catch(error => {
          console.log(error);
        });
    });
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

    </View>

  );
}

export default MeetingScreen;