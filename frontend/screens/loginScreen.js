import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';


const LoginScreen = ({ navigation }) => {

    const [username, setUsername] = useState('');

    return (
        <View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} placeholder="Please enter username" onChangeText={username => setUsername(username)} />
            <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
                <Button title="Login" onPress={() => navigation.navigate('Meeting')} />
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
        paddingBottom: 10,
    },
    input: {
        marginHorizontal: 20,
        backgroundColor: "white",
    }
});

export default LoginScreen;