import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { socket } from './meetingScreen';

const MeetingChatScreen = () => {

    const [meetingchat, setMeetingchat] = useState([]);
    const [chat, setChat] = useState("");

    useEffect(() => {
        socket.on('chat', msg => {
            setMeetingchat([...meetingchat, msg])
        })
    }, [meetingchat])

    let submitChat = () => {
        socket.emit('chat', chat);
        setChat("");
    }

    return (

        <View>
            <View style={{ marginHorizontal: 20,marginTop: 10}}>
            {meetingchat.map(msg => <Text key={msg}>{msg}</Text>)}
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                <TextInput style={{ width: 300 }} placeholder="Please enter some message" onChangeText={text => setChat(text)} value={chat} onSubmitEditing={submitChat} />
                <Icon name={`telegram`} size={30} onPress={submitChat} />
            </View>
        </View>

    );
}

export default MeetingChatScreen;