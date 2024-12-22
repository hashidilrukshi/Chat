import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from "../url";
import { useFocusEffect } from '@react-navigation/native';

const ChatScreen = ({ route }) => {
    const { senderId, receiverId, receiverName } = route.params;
    const [message, setMessage] = useState('');
    const [chatId, setChatId] = useState('');
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);

    useFocusEffect(
        useCallback(() => {


            fetchMessages();

            // WebSocket connection setup
            const connectWebSocket = () => {
                ws.current = new WebSocket(`${SOCKET_URL}`);

                ws.current.onmessage = (event) => {
                    const newMessage = JSON.parse(event.data);
                    setMessages((prev) => [...prev, newMessage]);  // Append new messages
                };

                ws.current.onclose = () => {
                    setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
                };
            };

            connectWebSocket();

            // Cleanup WebSocket when screen is unfocused
            return () => {
                if (ws.current) {
                    ws.current.close();
                }
            };
        }, [])  // Empty dependency array ensures this runs on screen focus every time
    );
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/messages/${receiverId}/${senderId}`);
            setChatId(response.data.chatId)
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    // Send a new message
    const handleSendMessage = async () => {
        if (!message.trim()) {
            console.error('Message is empty');
            return;
        }

        const newMessage = {
            chatId,
            senderId,
            receiverId,
            message: message.trim(),
        };

        try {
            const response = await axios.post(`${BASE_URL}/messages`, newMessage);
            if (response.status === 200) {
                fetchMessages();
                setMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error.response?.data || error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerName}>{receiverName}</Text>
            </View>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <Text
                        style={item.sender_id == senderId ? styles.sent : styles.received}
                    >
                        {item.message}
                    </Text>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={`Message ${receiverName}...`}
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-end',
    },
    header: {
        padding: 10,
        backgroundColor: '#AFE1AF',
        alignItems: 'center',
        justifyContent: 'center',
        //borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerName: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    sent: {
        alignSelf: 'flex-end',
        backgroundColor: '#03C03C',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        color: 'white',
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#EAEAEA',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    sendButton: {
        padding: 10,
        backgroundColor: '#03C03C',
        borderRadius: 5,
    },
});

export default ChatScreen;
