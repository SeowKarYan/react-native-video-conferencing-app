import React, {useState} from 'react';
import { TextInput, View, Button, StyleSheet } from 'react-native';

const MeetingScreen = ({ navigation }) => {

  const [meetingcode, setMeetingcode] = useState('');

  return (
    <View>
      <View style={{ paddingTop: 20 }}>
        <Button title="Create Meeting" onPress={() => navigation.navigate('InMeeting')} />
      </View>
      <TextInput placeholder="Please enter meeting code" onChangeText={meetingcode => setMeetingcode(meetingcode)} />
      <View style={{ paddingTop: 20 }}>
        <Button title="Join Meeting" onPress={() => navigation.navigate('InMeeting')} />
      </View>
    </View>
  );
}

export default MeetingScreen;