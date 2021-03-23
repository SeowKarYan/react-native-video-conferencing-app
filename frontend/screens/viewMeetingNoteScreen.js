import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, SafeAreaView, Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

const ViewMeetingNoteScreen = ({ route, navigation }) => {

    const { user_id } = route.params;
    let [flatListItems, setFlatListItems] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM note_table where user_id = ?', [user_id], (tx, results) => {
                var temp = [];
                var len = results.rows.length;
                console.log('get user note', len);
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                setFlatListItems(temp);
            });
        });
    }, []);

    let listViewItemSeparator = () => {
        return (
            <View
                style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }}
            />
        );
    };

    let deleteNote = (note_id) => {
        console.log("delete note id: " + note_id);

        db.transaction(tx => {
            tx.executeSql(
              'DELETE FROM note_table where note_id=?',
              [note_id],
              (tx, results) => {
                console.log('Number of row affected for delete note', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'Meeting note deleted successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.navigate('Meeting'),
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  alert('Meeting note failed to delete.');
                }
              }
            );
          });
    }

    let listItemView = (item) => {
        return (
            <View
                key={item.note_id}
                style={{ backgroundColor: 'white', padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Icon style={{ paddingHorizontal: 5 }} name={'edit'} size={30} onPress={() => navigation.navigate('EditMeetingNote', { note_id: item.note_id, title: item.title, description: item.description, user_id: item.user_id })} />
                    <Icon color="red" style={{ paddingHorizontal: 5 }} name={'delete'} size={30} onPress={() => deleteNote(item.note_id)} />
                </View>
                <Text>Title: {item.title}</Text>
                <Text>Description: {item.description}</Text>
            </View>
        );
    };

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={flatListItems}
                        ItemSeparatorComponent={listViewItemSeparator}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => listItemView(item)}
                    />
                </View>
            </View>
        </SafeAreaView>

    );
}

export default ViewMeetingNoteScreen;