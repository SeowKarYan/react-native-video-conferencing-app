import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

const EditMeetingNote = ({ route, navigation }) => {

    const { note_id, title, description, user_id } = route.params;
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');

    useEffect(() => {
        setNoteTitle(title);
        setNoteDescription(description);
    }, [])

    let updateNote = () => {
        console.log("Update note",note_id,noteTitle,noteDescription,user_id);

        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE note_table set title=?, description=?,user_id=? where note_id=?',
                [noteTitle, noteDescription, user_id, note_id],
                (tx, results) => {
                    console.log('Update note', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            'Meeting note updated successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate('Meeting'),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else alert('Updation Failed');
                }
            );
        });

    }

    return (

        <View style={{ paddingLeft: 10, paddingTop: 10 }}>
            <Icon color="green" style={{ paddingTop: 10, paddingRight: 20, textAlign: "right" }} name={'check-circle'} size={40} onPress={updateNote} />
            <Text style={{ fontWeight: "bold" }}>Title: </Text>
            <TextInput style={{ paddingLeft: 20, paddingBottom: 30 }} placeholder="Please enter note title" onChangeText={text => setNoteTitle(text)} value={noteTitle} />
            <Text style={{ fontWeight: "bold" }}>Description: </Text>
            <TextInput style={{ paddingLeft: 20 }} multiline placeholder="Please enter your note here" onChangeText={text => setNoteDescription(text)} value={noteDescription} />
        </View>

    );
}

export default EditMeetingNote;