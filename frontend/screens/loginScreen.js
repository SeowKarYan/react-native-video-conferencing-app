import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
//import { openDatabase } from 'react-native-sqlite-storage';

//Connction to access the pre-populated user.db
//var db = openDatabase({ name: 'user.db', createFromLocation : 1});

const LoginScreen = ({ navigation }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
/*
    useEffect(() => {
        db.transaction(function (txn) {
          txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='user_table'",
            [],
            function (tx, res) {
              console.log('item:', res.rows.length);
              if (res.rows.length == 0) {
                txn.executeSql('DROP TABLE IF EXISTS user_table', []);
                txn.executeSql(
                  'CREATE TABLE IF NOT EXISTS user_table(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), password VARCHAR(20), email VARCHAR(30))',
                  []
                );
              }
            }
          );
        });
      }, []);*/

      let login_user = () => {

        if (!username) {
            alert('Please fill in your username');
            return;
        }
        if (!password) {
            alert('Please fill in your password');
            return;
        }
        navigation.navigate('Meeting',{username: username})
    };

    return (
        <View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} placeholder="Please enter username" onChangeText={text => setUsername(text)} value={username}/>
            <Text style={styles.label}>Password:</Text>
            <TextInput style={styles.input} placeholder="Please enter password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true}/>
            <View style={{ paddingTop: 20, marginHorizontal: 20, }}>
                <Button title="Login" onPress={login_user} />
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