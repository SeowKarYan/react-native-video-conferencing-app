import React, { useState, useEffect } from 'react';
import { TextInput, View, Button, Text } from 'react-native';
import io from "socket.io-client";
import Peer from 'react-native-peerjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  mediaDevices,
} from 'react-native-webrtc';

// connect to socket server
export const socket = io("http://192.168.1.110:3000");

const MeetingScreen = ({ route, navigation }) => {

  const { username, user_id } = route.params;
  const [meetingcode, setMeetingcode] = useState('');

  /*
    useEffect(() => {
     
    }, [])*/

  // connect to peer server
  let peerConnection = () => {
    const myPeer = new Peer(undefined, {
      host: '192.168.1.110',
      secure: false,
      port: '3001',
      path: '/',
    });

    return myPeer;
  }

  // generate random string for room ID
  let generateRoomID = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

  // when host create meeting
  let createMeeting = () => {

    const myPeer = peerConnection();

    const roomID = generateRoomID();

    myPeer.on('open', id => {
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
          navigation.navigate('InMeeting', {
            localStream: stream,
            roomID: roomID,
            peer: myPeer,
            username: username,
            user_id: user_id,
          });

          // when participate is joinning into the room
          socket.on('userConnected', (userID) => {

            // host calling the participate
            const call = myPeer.call(userID, stream);
            call.on('stream', userVideoStream => {
              navigation.navigate('InMeeting', {
                remoteStream: userVideoStream,
                otherUserID: userID
              });
            })

            // get share screen stream if participate share screen
            myPeer.on('call', call => {
              call.answer(stream);
              call.on('stream', userVideoStream => {
                navigation.navigate('InMeeting', {
                  remoteStream: userVideoStream,
                });
              })
            })

            // leave the meeting
            call.on('close', () => {
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

  // When participate join into meeting room
  let joinMeeting = () => {

    const myPeer = peerConnection();

    myPeer.on('open', id => {
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

          // participate answer the call
          myPeer.on('call', call => {
            call.answer(stream);
            call.on('stream', userVideoStream => {
              navigation.navigate('InMeeting', {
                localStream: stream,
                remoteStream: userVideoStream,
                roomID: meetingcode,
                otherUserID: call.peer,
                peer: myPeer,
                username: username,
                user_id: user_id,
              });
            })

            // when leaving the meeting
            call.on('close', () => {
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
      <View style={{ paddingTop: 20, paddingRight: 20 }}>
        <Icon style={{ textAlign: "right" }} name={'notebook'} size={30} onPress={() => navigation.navigate('ViewMeetingNote', {user_id: user_id})}/>
      </View>
      <View style={{ paddingVertical: 50, marginHorizontal: 20, }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center", paddingVertical: 20, }}>Welcome {username}</Text>
        <Button title="Create Meeting" onPress={createMeeting} />
      </View>

      <View style={{ marginHorizontal: 20, }}>
        <TextInput style={{ paddingBottom: 20 }} placeholder="Please enter meeting code" onChangeText={text => setMeetingcode(text)} value={meetingcode} />
        <Button title="Join Meeting" onPress={joinMeeting} />
      </View>


    </View>

  );
}

export default MeetingScreen;