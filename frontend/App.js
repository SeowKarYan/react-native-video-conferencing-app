import 'react-native-gesture-handler';

import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/loginScreen';
import MeetingScreen from './screens/meetingScreen';
import InMeetingScreen from './screens/inMeetingScreen';
import MeetingChatScreen from './screens/meetingChatScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'LOGIN', headerStyle: { backgroundColor: '#3949AB' }, headerTintColor: 'white' }} />
        <Stack.Screen name="Meeting" component={MeetingScreen} options={{ title: 'HOME', headerStyle: { backgroundColor: '#3949AB' }, headerTintColor: 'white' }} />
        <Stack.Screen name="InMeeting" component={InMeetingScreen} options={{ title: 'MEETING', headerStyle: { backgroundColor: '#3949AB' }, headerTintColor: 'white' }} />
        <Stack.Screen name="MeetingChat" component={MeetingChatScreen} options={{ title: 'MEETING CHAT', headerStyle: { backgroundColor: '#3949AB' }, headerTintColor: 'white' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;