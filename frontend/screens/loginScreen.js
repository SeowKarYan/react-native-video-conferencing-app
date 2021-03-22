import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='user_table'",
                [],
                function (tx, res) {
                    console.log('user table:', res.rows.length);
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
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='note_table'",
                [],
                function (tx, res) {
                    console.log('note table:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS note_table', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS note_table(note_id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(50), description VARCHAR(200), user_id INTEGER(5))',
                            []
                        );
                    }
                }
            );
        });
    }, []);

    let login_user = () => {

        if (!email) {
            alert('Please fill in your email');
            return;
        }
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            alert('Please fill in a valid email.');
            return;
        }
        if (!password) {
            alert('Please fill in your password');
            return;
        }
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user_table where email = ?',
                [email],
                (tx, results) => {
                    var len = results.rows.length;
                    console.log('login email', len);
                    if (len > 0) {
                        console.log("data:", results.rows.item(0));
                        if (results.rows.item(0).password == password) {
                            navigation.navigate('Meeting', { username: results.rows.item(0).username, user_id: results.rows.item(0).id })
                        } else {
                            alert('Wrong Password.');
                        }
                    } else {
                        alert('Please register an account before you login.');
                    }
                }
            );
        });
    };

    return (
        <View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} placeholder="Please enter your email" onChangeText={text => setEmail(text)} value={email} />
            <Text style={styles.label}>Password:</Text>
            <TextInput style={styles.input} placeholder="Please enter your password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true} />
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