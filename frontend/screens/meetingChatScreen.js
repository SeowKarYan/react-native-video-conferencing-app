import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import io from "socket.io-client";
import Peer from 'react-native-peerjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//const socket = io("http://192.168.1.106:3000");

const MeetingChatScreen = () => {

  return (
    <View>
      <Text>Meeting Chat</Text>
    </View>

  );
}

export default MeetingChatScreen;