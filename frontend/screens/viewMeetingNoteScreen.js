import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, SafeAreaView } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

//Connction to access the pre-populated user_db.sqlite
var db = openDatabase({ name: 'user_db.sqlite', createFromLocation: 1 });

const ViewMeetingNoteScreen = ({ route }) => {

    const { user_id } = route.params;
    let [flatListItems, setFlatListItems] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM note_table where user_id = ?', [user_id], (tx, results) => {
                var temp = [];
                var len = results.rows.length;
                    console.log('note', len);
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

    let listItemView = (item) => {
        return (
            <View
                key={item.note_id}
                style={{ backgroundColor: 'white', padding: 20 }}>
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