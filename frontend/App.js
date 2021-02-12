import 'react-native-gesture-handler';

import * as React from 'react';
import io from "socket.io-client";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/loginScreen';
import MeetingScreen from './screens/meetingScreen';
import InMeetingScreen from './screens/inMeetingScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Meeting" component={MeetingScreen} />
        <Stack.Screen name="InMeeting" component={InMeetingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;