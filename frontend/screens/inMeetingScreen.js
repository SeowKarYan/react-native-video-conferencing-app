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
import RadioButtonRN from 'radio-buttons-react-native';

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

var total = 0;
var percentageOfOption1 = 0;
var percentageOfOption2 = 0;
var numberOfOption1 = 0;
var numberOfOption2 = 0;

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
  const [createVoteModal, setCreateVoteModal] = useState(false);
  const [voteModal, setVoteModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [voteQuestion, setVoteQuestion] = useState('');
  const [voteOption1, setVoteOption1] = useState('');
  const [voteOption2, setVoteOption2] = useState('');
  const [option, setOption] = useState([]);
  const [answer, setAnswer] = useState();
  const [vote, setVote] = useState(false);
  const [voteResultModal, setVoteResultModal] = useState(false);

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

    socket.on('emitvote', (question, option1, option2) => {
      setVoteQuestion(question);
      setVoteOption1(option1);
      setVoteOption2(option2);
      setVoteModal(true);
      setOption([{ label: option1 }, { label: option2 }]);
      socket.on('emitanswer', (answer) => {
        calculateVote(answer, option1, option2);
        setVoteResultModal(!voteResultModal);
      })
    })

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
        pushMeetingChat("Meeting Chat", msg);
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

  let createVote = () => {
    if (!question) {
      alert('Please fill in the question field.');
      return;
    }
    if (!option1) {
      alert('Please fill in the first answer field.');
      return;
    }
    if (!option2) {
      alert('Please fill in the second answer field.');
      return;
    }
    console.log(question, option1, option2);
    socket.emit('vote', question, option1, option2);
    setQuestion("");
    setOption1("");
    setOption2("");
    setCreateVoteModal(!createVoteModal);
    total = 0;
    numberOfOption1 = 0;
    numberOfOption2 = 0;
    percentageOfOption1 = 0;
    percentageOfOption2 = 0;
  }

  let submitVote = () => {
    if (!answer) {
      alert('Please select the answer.');
      return;
    }

    setVoteModal(!voteModal);
    setVote(true);
    console.log(answer);
    socket.emit('submitvote', (answer));
  }

  let calculateVote = (answer, option1, option2) => {
    console.log("answer:", answer);
    console.log("option 1:", option1);
    console.log("option 2:", option2);
    total += 1;
    if (answer == option1) {
      numberOfOption1 += 1;
    }
    else {
      numberOfOption2 += 1;
    }
    percentageOfOption1 = (numberOfOption1 / total) * 100;
    percentageOfOption2 = (numberOfOption2 / total) * 100;
    console.log("Total:", total);
    console.log("Number of option 1:", numberOfOption1);
    console.log("Number of option 2:", numberOfOption2);
    console.log("Percentage of option 1:", percentageOfOption1);
    console.log("Percentage of Option 2:", percentageOfOption2);
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
        <Icon style={{ paddingHorizontal: 5 }} name={'vote'} size={30} onPress={() => setCreateVoteModal(true)} />
        {vote && <Icon style={{ paddingHorizontal: 5 }} name={'chart-bar'} size={30} onPress={() => setVoteResultModal(true)} />}
        <Icons color="red" style={{ paddingLeft: 30 }} name={'call-end'} size={30} onPress={endMeeting} />
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={createVoteModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setCreateVoteModal(!createVoteModal);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
          <View style={{ backgroundColor: "white", width: 250 }}>
            <Text style={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#5E35B1", color: "white", height: 30, paddingTop: 5 }}>Create Poll</Text>
            <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold" }}>Question:</Text>
            <TextInput placeholder="Please enter your question:" onChangeText={text => setQuestion(text)} value={question} />
            <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold" }}>Answer:</Text>
            <TextInput placeholder="Please enter your option 1:" onChangeText={text => setOption1(text)} value={option1} />
            <TextInput placeholder="Please enter your option 2:" onChangeText={text => setOption2(text)} value={option2} />
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Button color="green" title="Create Poll" onPress={createVote} />
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Button color="red" title="Cancel" onPress={() => setCreateVoteModal(!createVoteModal)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={voteModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setVoteModal(!voteModal);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
          <View style={{ backgroundColor: "white", width: 250 }}>
            <Text style={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#5E35B1", color: "white", height: 30, paddingTop: 5 }}>Let's Vote</Text>
            <Text style={{ paddingLeft: 10, paddingTop: 5 }}>Question:</Text>
            <Text style={{ paddingLeft: 10, paddingTop: 5 }}>{voteQuestion}</Text>
            <Text style={{ paddingLeft: 10, paddingTop: 5 }}>Answer:</Text>
            <RadioButtonRN
              data={option}
              selectedBtn={(e) => setAnswer(e)}
            />
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Button color="green" title="Submit" onPress={submitVote} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={voteResultModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setVoteResultModal(!voteResultModal);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
          <View style={{ backgroundColor: "white", width: 250 }}>
            <Text style={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#5E35B1", color: "white", height: 30, paddingTop: 5 }}>Poll Result</Text>
            <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold" }}>Question:</Text>
            <Text style={{ paddingLeft: 10 }}>{voteQuestion}</Text>
            <Text style={{ paddingLeft: 10, paddingTop: 5, fontWeight: "bold" }}>Answer:</Text>
            <Text style={{ paddingLeft: 10 }}>{voteOption1 + ": " + percentageOfOption1 + "%"}</Text>
            <Text style={{ paddingLeft: 10 }}>{voteOption2 + ": " + percentageOfOption2 + "%"}</Text>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Button title="Close" onPress={() => setVoteResultModal(!voteResultModal)} />
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