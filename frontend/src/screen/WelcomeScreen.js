import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const WelcomeScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { userId, token } = route.params || {};

    useEffect(() => {
        if (!userId || !token) {
            Alert.alert('Error', 'User data is missing.');
            navigation.replace('LoginScreen'); // Redirect to login if data is missing
        }
    }, [userId, token]);

    const handleGoToChatList = () => {
        navigation.navigate('ChatListScreen', { userId });
    };

    return (
        <ImageBackground
            source={require('../assets/bd3.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>

                <TouchableOpacity style={styles.button} onPress={handleGoToChatList}>
                    <Text style={styles.buttonText}>Go to Chat List</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,

        width: '100%',
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    userInfo: {
        fontSize: 18,
        color: '#ddd',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
        position: 'absolute',
        bottom: 80,
        right: 20,
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;
