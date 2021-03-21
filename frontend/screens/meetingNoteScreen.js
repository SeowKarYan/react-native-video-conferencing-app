import React, { useState, useEffect } from 'react';
import { Text, View, TextInput } from 'react-native';

const MeetingNoteScreen = () => {

    const [note, setNote] = useState("");

    return (

        <View>
            <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <TextInput multiline placeholder="Please enter your note" onChangeText={text => setNote(text)} value={note} />
            </View>
        </View>

    );
}

export default MeetingNoteScreen;