import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';


const LoginScreen = ({ navigation }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} placeholder="Please enter username" onChangeText={text => setUsername(text)} value={username}/>
            <Text style={styles.label}>Password:</Text>
            <TextInput style={styles.input} placeholder="Please enter password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true}/>
            <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
                <Button title="Login" onPress={() => navigation.navigate('Meeting',{username: username})} />
            </View>
            <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
                <Button title="Register" onPress={() => navigation.navigate('Register')} />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 20,
    },
    label: {
        paddingLeft: 20,
        paddingVertical: 10,
    },
    input: {
        marginHorizontal: 20,
        backgroundColor: "white",
    }
});

export default LoginScreen;