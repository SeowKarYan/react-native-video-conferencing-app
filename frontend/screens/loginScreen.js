import React, {useState} from 'react';
import { Text, View, TextInput, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {

    const [username, setUsername] = useState('');

    return (
        <View>
            <View>
                <Text>Welcome</Text>
            </View>
            <View>
                <TextInput placeholder="Please enter username" onChangeText={username => setUsername(username)} />
            </View>
            <View>
                <Button title="Login" onPress={() => navigation.navigate('Meeting')} />
            </View>
        </View>

    );
}

export default LoginScreen;