import React, { useState } from 'react';
import { Text, View, Button, TextInput, Alert, } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

const RegisterScreen = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  let register_user = () => {
    console.log("Register user:" + username, email, password);

    if (!username) {
      alert('Please fill in your username.');
      return;
    }
    if (!email) {
      alert('Please fill in your email.');
      return;
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      alert('Please fill in a valid email.');
      return;
    }
    if (!password) {
      alert('Please fill in your password.');
      return;
    }
    if (!confirmPassword) {
      alert('Please fill in confirm password.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Password and Confirm Password are not same.');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO user_table (username, password, email) VALUES (?,?,?)',
        [username, password, email],
        (tx, results) => {
          console.log('Insert user', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Login'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Registration Failed');
        }
      );
    });
  };

  return (

    <View>
      <Text style={{ textAlign: "center", paddingVertical: 20, }}>Please fill in the information to register an account.</Text>
      <Text style={{ paddingLeft: 20, paddingVertical: 10, }}>Username:</Text>
      <TextInput style={{ marginHorizontal: 20, backgroundColor: "white", }} placeholder="Please enter your username" onChangeText={text => setUsername(text)} value={username} />
      <Text style={{ paddingLeft: 20, paddingVertical: 10, }}>Email:</Text>
      <TextInput style={{ marginHorizontal: 20, backgroundColor: "white", }} placeholder="Please enter your email" onChangeText={text => setEmail(text)} value={email} />
      <Text style={{ paddingLeft: 20, paddingVertical: 10, }}>Password:</Text>
      <TextInput style={{ marginHorizontal: 20, backgroundColor: "white", }} placeholder="Please enter your password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true} />
      <Text style={{ paddingLeft: 20, paddingVertical: 10, }}>Confirm Password:</Text>
      <TextInput style={{ marginHorizontal: 20, backgroundColor: "white", }} placeholder="Please enter your password again" onChangeText={text => setConfirmPassword(text)} value={confirmPassword} secureTextEntry={true} />
      <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
        <Button title="Register" onPress={register_user} />
      </View>
    </View>

  );
}

export default RegisterScreen;