import React, { useState, useEffect, useRef } from 'react';
import { TextInput, View, Button, StyleSheet,Text } from 'react-native';
import io from "socket.io-client";
import Peer from 'react-native-peerjs';

const socket = io("http://192.168.1.111:3000");
/*
const myPeer = new Peer(undefined,{
  host: '192.168.1.111',
  secure: false,
  port: '3001',
  path: '/',
});
*/
const MeetingScreen = ({ navigation }) => {

  const [meetingcode, setMeetingcode] = useState('');
  const [userID, setUserID] = useState('');

  useEffect(() => {
    const myPeer = new Peer(undefined,{
      host: '192.168.1.111',
      secure: false,
      port: '3001',
      path: '/',
    });

    myPeer.on('open', id => {
      setUserID(id);
    })
  }, [])

  let generateRoomID = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

  let createMeeting = () => {
    /*
    const myPeer = new Peer(undefined,{
      host: '192.168.1.111',
      secure: false,
      port: '3001',
      path: '/',
    });

    myPeer.on('open', id => {
      setUserID(id);
    })
    */
/*
    socket.on('createRoom',(roomID)=>{
      setMeetingcode(roomID);
      
      socket.emit('joinRoom',roomID,userID)
      socket.on('userConnected',(userID)=>{
        console.log(userID)
      })
    })*/

    const roomID = generateRoomID();
    setMeetingcode(roomID);

    socket.emit('joinRoom',roomID,userID)
    socket.on('userConnected',(userID)=>{
        console.log(userID)
      })
    //navigation.navigate('InMeeting');
  }

  let joinMeeting = () => {
    
    socket.emit('joinRoom',meetingcode,userID)
    socket.on('userConnected',(userID)=>{
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
    </View>
  );
}

export default MeetingScreen;