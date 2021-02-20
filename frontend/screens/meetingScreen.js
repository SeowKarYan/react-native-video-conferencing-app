import React, { useState, useEffect } from 'react';
import { TextInput, View, Button, StyleSheet,Text } from 'react-native';
import io from "socket.io-client";

const MeetingScreen = ({ navigation }) => {

  const [meetingcode, setMeetingcode] = useState('');

/*
  useEffect(() => {
    const socket = io("http://192.168.1.110:3000");
    socket.on('createRoom',(roomID)=>{
      setMeetingcode(roomID);
    })
  }, [])
*/

  let createMeeting = () => {
    const socket = io("http://192.168.1.110:3000");
    socket.on('createRoom',(roomID)=>{
      setMeetingcode(roomID);
    })
    //navigation.navigate('InMeeting');
  }

  let joinMeeting = () => {
    navigation.navigate('InMeeting');
  }

  return (
    <View>
      <View style={{ paddingVertical: 50, marginHorizontal: 20, }}>
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