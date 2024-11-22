import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../Services/AuthService';

type RootStackParamList = {
    Login: undefined;
    CreateUser: undefined;
    Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginUserScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('palr12202000@gmail.com');
    const [password, setPassword] = useState('Alejandro16!');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await AuthService.signInUser(email, password);
            if (response?.user) {
                navigation.replace('Home');
            } else {
                setErrorMessage('Invalid email or password. Please try again.');
            }
        } catch (error: any) {
            setErrorMessage('The email or password you entered is incorrect');
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {errorMessage ? 'Login Failed' : 'Welcome Back!'}
            </Text>
            {errorMessage && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Unable to Sign In</Text>
                    <Text style={styles.error}>{errorMessage}</Text>
                </View>
            )}
            <Text style={[styles.subtitle, errorMessage && styles.errorSubtitle]}>
                {errorMessage 
                    ? 'Please check your credentials and try again'
                    : 'Please sign in to continue'}
            </Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={!loading}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CreateUser')} disabled={loading}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    link: {
        color: '#000',
        textAlign: 'center',
        marginTop: 15,
    },
    error: {
        color: '#D32F2F',
        textAlign: 'center',
        fontSize: 14,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    errorSubtitle: {
        color: '#FF6B6B',
    },
    errorContainer: {
        backgroundColor: '#FFE5E5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    errorTitle: {
        color: '#D32F2F',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
});

export default LoginUserScreen;
