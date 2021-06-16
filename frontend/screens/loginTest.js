import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';

const LoginTest = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let login_user = () => {

        navigation.navigate('Meeting');
    };

    return (
        <View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.label}>Email:</Text>
            <TextInput testID="emailTextInput" style={styles.input} placeholder="Please enter your email" onChangeText={text => setEmail(text)} value={email} />
            <Text style={styles.label}>Password:</Text>
            <TextInput testID="passwordTextInput" style={styles.input} placeholder="Please enter your password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true} />
            <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
                <Button testID="loginButton" title="Login" onPress={login_user} />
            </View>
            <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
                <Button testID="registerButton" title="Register" onPress={() => navigation.navigate('Register')} />
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

export default LoginTest;