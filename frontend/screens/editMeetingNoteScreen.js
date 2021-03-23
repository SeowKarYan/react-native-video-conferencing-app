import React, { useState, useEffect } from 'react';
import { Text, View, TextInput } from 'react-native';

const EditMeetingNote = ({ route }) => {

    const { note_id } = route.params;

    return (

        <View>
           <Text>Edit: {note_id}</Text>
        </View>

    );
}

export default EditMeetingNote;