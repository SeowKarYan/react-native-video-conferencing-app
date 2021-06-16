// test for calculate vote function
import { calculateVote } from '../screens/inMeetingTest';
test('calculate vote', () => {
  // if the user choose option 1
  expect(calculateVote("Apple", "Apple", "Orange")).toEqual([100, 0]);
  // if the user choose option 2
  expect(calculateVote("Orange", "Apple", "Orange")).toEqual([0, 100]);
});

// test the login screen
import React from 'react';
import { create } from 'react-test-renderer';
import LoginTest from '../screens/loginTest';

const navigation = {
  navigate: jest.fn()
}

const tree = create(<LoginTest navigation={navigation} />);

// test the navigation when register button is pressed
test('navigate to register page', () => {
  const button = tree.root.findByProps({ testID: 'registerButton' }).props;
  button.onPress();

  expect(navigation.navigate).toBeCalledWith('Register');
});

// test the navigation when login button is pressed
test('navigate to login page', () => {
  const button = tree.root.findByProps({ testID: 'loginButton' }).props;
  button.onPress();

  expect(navigation.navigate).toBeCalledWith('Meeting');
});