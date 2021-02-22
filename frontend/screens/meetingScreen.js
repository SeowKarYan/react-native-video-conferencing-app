import React, { useState, useEffect } from 'react';
import { TextInput, View, Button, StyleSheet,Text } from 'react-native';
import io from "socket.io-client";
import Peer from 'react-native-peerjs';

const MeetingScreen = ({ navigation }) => {

  const [meetingcode, setMeetingcode] = useState('');
  const [userID, setUserID] = useState('');

/*
  useEffect(() => {
    const socket = io("http://192.168.1.110:3000");
    socket.on('createRoom',(roomID)=>{
      setMeetingcode(roomID);
    })
  }, [])
*/

  let createMeeting = () => {
    const socket = io("http://192.168.1.111:3000");
    
    const myPeer = new Peer(undefined,{
      host: '192.168.1.111',
      port: '3001',
    });
    socket.on('createRoom',(roomID, userID)=>{
      setMeetingcode(roomID);
      setUserID(userID);
      socket.emit('joinRoom',roomID,userID)
      socket.on('userConnected',(userID)=>{
        console.log(userID)
      })
    })
    
    //navigation.navigate('InMeeting');
  }

  let joinMeeting = () => {
    const socket = io("http://192.168.1.111:3000");
    socket.on('getUserID',(userID)=>{
      setUserID(userID);
      socket.emit('joinRoom',meetingcode,userID)
      socket.on('userConnected',(userID)=>{
        console.log(userID)
      })
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