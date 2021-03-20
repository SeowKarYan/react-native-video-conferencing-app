import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';

const RegisterScreen = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (

        <View>
            <Text style={{textAlign: "center", paddingVertical: 20,}}>Please fill in the information to register an account.</Text>
            <Text style={{paddingLeft: 20,paddingVertical: 10,}}>Username:</Text>
            <TextInput style={{marginHorizontal: 20,backgroundColor: "white",}} placeholder="Please enter your username" onChangeText={text => setUsername(text)} value={username}/>
            <Text style={{paddingLeft: 20,paddingVertical: 10,}}>Email:</Text>
            <TextInput style={{marginHorizontal: 20,backgroundColor: "white",}} placeholder="Please enter your email" onChangeText={text => setEmail(text)} value={email}/>
            <Text style={{paddingLeft: 20,paddingVertical: 10,}}>Password:</Text>
            <TextInput style={{marginHorizontal: 20,backgroundColor: "white",}} placeholder="Please enter your password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true}/>
            <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
                <Button title="Register" />
            </View>
        </View>

    );
}

export default RegisterScreen;