import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from "../url";

const RegisterScreen = () => {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.userName) newErrors.userName = 'User Name is required';
        if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
            newErrors.phoneNumber = 'Valid 10-digit Phone Number is required';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Valid Email is required';
        if (!formData.password || formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters long';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendSignupRequest = async () => {
        try {
            const response = await axios.post(
                `${BASE_URL}/register`,
                {
                    userName: formData.userName,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    password: formData.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                console.log('Registration successful:', response.data.message);
                Alert.alert('Success', 'Registration completed successfully!');
                navigation.navigate('LoginScreen');
            } else {
                console.error('Error during registration:', response.data.message);
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            sendSignupRequest(formData);
        } else {
            Alert.alert(
                'Form Validation Failed',
                'Please check the errors and try again.',
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.signContainer}>
                <Text style={styles.signText}>User Register</Text>
                <Text style={styles.infoText}>
                    Enter your details to register as a user
                </Text>
            </View>

            <Text style={styles.details}> Full Name </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="User Name"
                    value={formData.userName}
                    onChangeText={value => handleInputChange('userName', value)}
                />
                {errors.userName && (
                    <Text style={styles.errorText}>{errors.userName}</Text>
                )}
            </View>

            <Text style={styles.details}> Email </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={value => handleInputChange('email', value)}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <Text style={styles.details}> Mobile Number </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Phone Number"
                    keyboardType="numeric"
                    value={formData.phoneNumber}
                    onChangeText={value => handleInputChange('phoneNumber', value)}
                />
                {errors.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}
            </View>

            <Text style={styles.details}> Password </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={value => handleInputChange('password', value)}
                />
                {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                )}
            </View>

            <TouchableOpacity style={styles.payButton} onPress={handleSubmit}>
                <Text style={styles.payButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    signContainer: {
        marginBottom: 20,
    },
    signText: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: '#03C03C',
    },
    infoText: {
        color: 'black',
    },
    details: {
        color: 'black',
        textAlign: 'left',
        alignSelf: 'flex-start',
        fontSize: 15,
        marginBottom: 5,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 5,
    },
    textInput: {
        fontSize: 16,
        color: '#333',
    },
    payButton: {
        backgroundColor: '#03C03C',
        paddingVertical: 10,
        paddingHorizontal: 70,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});
