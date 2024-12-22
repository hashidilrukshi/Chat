import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../url";

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [senderId, setSenderId] = useState('');

    useEffect(() => {
        const fetchSenderId = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                setSenderId(userId);
                fetchChats(userId);
            } catch (error) {
                console.error("Error fetching userId from AsyncStorage", error);
            }
        };
        const fetchChats = async (sId) => {
            try {
                const response = await axios.get(`${BASE_URL}/users/${sId}`);
                const result = response.data;
                setChats(result);
                setFilteredChats(result);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSenderId();

    }, []);



    const handleSearchChange = (text) => {
        setSearchTerm(text);

        if (text === '') {
            setFilteredChats(chats);
        } else {
            const filtered = chats.filter(chat =>
                chat.userName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredChats(filtered);
        }
    };

    const handleChatPress = (receiverId, receiverName) => {
        navigation.navigate('ChatScreen', {
            senderId: senderId,
            receiverName: receiverName,
            receiverId: receiverId,
        });

    };







    const renderChatItem = ({ item }) => {
        // console.log(item);
        return (
            <TouchableOpacity
                onPress={() => handleChatPress(item.id, item.userName)}
                style={styles.chatItem}>
                <Text style={styles.chatName}>{item.userName}</Text>
            </TouchableOpacity>
        );
    };




    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#03C03C" style={styles.loader} />;
        }

        if (filteredChats.length === 0) {
            return <Text style={styles.noChats}>No users found</Text>;
        }

        return (
            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.chatList}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerName}>Chat List</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchTerm}
                    onChangeText={handleSearchChange}
                />
            </View>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        padding: 15,
        backgroundColor: '#03C03C',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerName: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    searchContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
    },
    chatList: {
        marginTop: 10,
    },
    chatItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    chatName: {
        fontSize: 18,
    },
    loader: {
        marginTop: 20,
    },
    noChats: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default ChatListScreen;
