import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TextInput, Modal, Button } from 'react-native';
//import Peer from 'react-native-peerjs';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import {
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import { socket } from './meetingScreen';
import { openDatabase } from 'react-native-sqlite-storage';
import PushNotification from "react-native-push-notification";

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

const InMeetingScreen = ({ route, navigation }) => {
  const { localStream, remoteStream, roomID, otherUserID, peer, username, user_id, myuserID } = route.params;
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [screen, setScreen] = useState(false);
  const [otherStream, setOtherStream] = useState();
  const [myStream, setMyStream] = useState();
  const [myPeer, setMyPeer] = useState();
  const [note, setNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [meetingchat, setMeetingchat] = useState([]);
  const [chat, setChat] = useState('');
  const [chatModal, setChatModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);

  useEffect(() => {
    setMyStream(localStream);
    setMyPeer(peer);
    var date = new Date().getDate(); //To get the Current Date
    var month = new Date().getMonth() + 1; //To get the Current Month
    var year = new Date().getFullYear(); //To get the Current Year  
    setNoteTitle("Meeting Note(" + date + "/" + month + "/" + year + ")");
    
    PushNotification.createChannel(
      {
        channelId: "channel-id",
        channelName: "My channel",
        channelDescription: "A channel to categorise your notifications",
      },
    );
  }, [])

  useEffect(() => {
    setOtherStream(remoteStream);
  }, [remoteStream])

  useEffect(() => {
    socket.on('emitchat', msg => {
      setMeetingchat([...meetingchat, msg])
    })
   
  }, [meetingchat])

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

      socket.on('emitchat', msg => {
          pushMeetingChat("Meeting Chat",msg);
      })

    } else {
      setScreen(!screen);
      setMyStream(localStream);
      stopService();
      myPeer.call(otherUserID, localStream);
    }
  }

  let pushMeetingChat = (title, message) => {

    PushNotification.localNotification({
      channelId: "channel-id",
      title: title,
      message: message,
    });
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

  let submitChat = () => {
    socket.emit('chat', (username + ": " + chat));
    setChat("");
  }

  let endMeeting = () => {

    socket.emit('leave-room', roomID, myuserID);

    if (!note) {
      navigation.navigate('Meeting');
    } else {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO note_table (title, description, user_id) VALUES (?,?,?)',
          [noteTitle, note, user_id],
          (tx, results) => {
            console.log('Insert note', results.rowsAffected);
            if (results.rowsAffected > 0) {
              alert('Your meeting note have successfully saved.');
              navigation.navigate('Meeting');
            } else alert('Your meeting note failed to save.');
          }
        );
      });
    }
  }

  return (

    <ScrollView>
      <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
        <Icon style={{ paddingHorizontal: 5 }} name={`${camera && 'camera' || 'camera-off'}`} size={30} onPress={turnCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${mic && 'microphone' || 'microphone-off'}`} size={30} onPress={turnMic} />
        <Icon style={{ paddingHorizontal: 5 }} name={'camera-switch'} size={30} onPress={switchCamera} />
        <Icon style={{ paddingHorizontal: 5 }} name={`${screen && 'arrow-down-bold-box' || 'arrow-up-bold-box'}`} size={30} onPress={shareScreen} />
        <Icon style={{ paddingHorizontal: 5 }} name={'comment-text-multiple'} size={30} onPress={() => setChatModal(true)} />
        <Icon style={{ paddingHorizontal: 5 }} name={'notebook'} size={30} onPress={() => setNoteModal(true)} />
        <Icons color="red" style={{ paddingLeft: 60 }} name={'call-end'} size={30} onPress={endMeeting} />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={chatModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setChatModal(!chatModal);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
          <View style={{ backgroundColor: "white" }}>
            <Text style={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#5E35B1", color: "white", height: 30, paddingTop: 5 }}>Meeting Chat</Text>
            <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
              {meetingchat.map(msg => <Text key={msg}>{msg}</Text>)}
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10 }}>
              <TextInput style={{ width: 200 }} placeholder="messages..." onChangeText={text => setChat(text)} value={chat} onSubmitEditing={submitChat} />
              <Icon name={`telegram`} size={30} onPress={submitChat} />
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
              <Button title="Close" onPress={() => setChatModal(!chatModal)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={noteModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setNoteModal(!noteModal);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
          <View style={{ backgroundColor: "white", width: 250 }}>
            <Text style={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#5E35B1", color: "white", height: 30, paddingTop: 5 }}>Meeting Note</Text>
            <Text style={{ paddingLeft: 10, paddingTop: 5 }}>Title:</Text>
            <TextInput placeholder="Please enter note title" onChangeText={text => setNoteTitle(text)} value={noteTitle} />
            <Text style={{ paddingLeft: 10 }}>Description:</Text>
            <TextInput multiline placeholder="Please enter your note here" onChangeText={text => setNote(text)} value={note} />
            <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
              <Button title="Close" onPress={() => setNoteModal(!noteModal)} />
            </View>
          </View>
        </View>
      </Modal>

      <Text style={{ paddingVertical: 10, fontWeight: "bold", textAlign: "center" }}>Room ID: {roomID}</Text>
      <View style={{ flexDirection: 'row', }}>
        {myStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
          streamURL={myStream.toURL()}
        />}
        {otherStream && <RTCView style={{ width: 200, height: 200, borderColor: "red", backgroundColor: "black" }}
          streamURL={otherStream.toURL()}
        />}
      </View>
    </ScrollView>


  );
}

export default InMeetingScreen;