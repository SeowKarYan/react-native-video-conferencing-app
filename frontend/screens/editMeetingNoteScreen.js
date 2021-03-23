import React, { useState, useEffect } from 'react';
import { Text, View, TextInput } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

const EditMeetingNote = ({ route }) => {

    const { note_id, title, description } = route.params;
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');

    useEffect(() => {
        setNoteTitle(title);
        setNoteDescription(description);
    }, [])

    let updateNote = () => {
        console.log("Update note:",note_id, noteTitle, noteDescription);
    }

    return (

        <View style={{paddingLeft: 10, paddingTop: 10}}>
            <Icon color="green" style={{ paddingTop:10,paddingRight:20, textAlign: "right" }} name={'check-circle'} size={40} onPress={updateNote}/>
            <Text style={{fontWeight: "bold"}}>Title: </Text>
            <TextInput style={{paddingLeft: 20, paddingBottom: 30}} placeholder="Please enter note title" onChangeText={text => setNoteTitle(text)} value={noteTitle} />
            <Text style={{fontWeight: "bold"}}>Description: </Text>
            <TextInput style={{paddingLeft: 20}} multiline placeholder="Please enter your note here" onChangeText={text => setNoteDescription(text)} value={noteDescription} />
        </View>

    );
}

export default EditMeetingNote;