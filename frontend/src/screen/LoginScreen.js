import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../url";

const LoginScreen = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigation = useNavigation();

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, userId } = response.data;
                await AsyncStorage.clear();
                await AsyncStorage.setItem('userId', userId.toString());
                await AsyncStorage.setItem('token', token);
                console.log('Login successful => ', userId.toString());
                navigation.replace('WelcomeScreen', { userId, token });
            }
        } catch (error) {
            console.error('Error during login:', error);
            if (error.response) {
                Alert.alert('Login Failed', error.response.data.message || 'Server error occurred.');
            } else {
                Alert.alert('Network Error', 'Please check your internet connection.');
            }
        }
    };


    const handleLogin = async () => {
        if (validateInputs()) {
            await loginUser(formData.email, formData.password);
        }
    };

    const handleregister = () => {
        navigation.navigate('RegisterScreen');
    };

    const validateEmail = email => {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    };

    const validateInputs = () => {
        const { email, password } = formData;

        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid Email.');
            return false;
        }

        if (password.trim() === '') {
            Alert.alert('Password required', 'Please enter a password.');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
            return false;
        }

        return true;
    };

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <ImageBackground
            source={require('../assets/bg.jpg')}
            style={styles.container}>
            <View style={styles.loginBox}>
                <Text style={styles.logInText}>Welcome !</Text>
                <Text style={styles.logInText2}>Agrivise</Text>
                <Text style={styles.infoText}>
                    Cultivating your farming success 🌱
                </Text>

                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome
                        name={'user'}
                        size={20}
                        color={'#C08497'}
                        style={styles.InputIcon}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your Email"
                        placeholderTextColor="#d3c0c0"
                        onChangeText={value => handleInputChange('email', value)}
                    />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome
                        name={'lock'}
                        size={20}
                        color={'#C08497'}
                        style={styles.InputIcon}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your password"
                        placeholderTextColor="#d3c0c0"
                        secureTextEntry
                        onChangeText={value => handleInputChange('password', value)}
                    />
                </View>

                <TouchableOpacity style={styles.logbutton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <Text style={styles.dontText}>Don’t have an account?</Text>
                <TouchableOpacity onPress={handleregister}>
                    <Text style={styles.resgister}>Register Now</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default LoginScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loginBox: {
        width: '85%',
        backgroundColor: '#FFFFFFCC',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
    },
    logInText: {
        fontSize: 32,
        color: '#03C03C',
        fontWeight: 'bold',
    },
    logInText2: {
        fontSize: 32,
        color: '#03C03C',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 16,
        color: '#03C03C',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#5C374C',
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 5,
        marginVertical: 10,
        alignItems: 'center',
        paddingHorizontal: 15,
        width: '100%',
    },
    InputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        color: '#5C374C',
    },
    logbutton: {
        backgroundColor: '#03C03C',
        paddingVertical: 15,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dontText: {
        color: '#00AB66',
        marginTop: 10,
    },
    resgister: {
        color: '#00AB66',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
