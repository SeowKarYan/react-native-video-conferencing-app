import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import io from "socket.io-client";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomid: ""
    }
  }

  createMeeting(){
    const socket = io("http://192.168.1.109:3000")
    socket.on('create-room',(roomid)=>{
      console.log(roomid);
      this.setState({roomid: roomid})
    })
  }

  joinMeeting(){

  }

  render() {
    return (
      <View>
          <Button onPress={this.createMeeting()} title="Create Meeting" />
          <Text>
            {"RoomID:" + this.state.roomid}
          </Text>
      
        <Button onPress={this.joinMeeting()} title="Join Meeting" />
      </View>
    );
  }
}

export default App;