import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as FS from 'expo-file-system';


import styles from '../styles/styles';
import { sha512_256 } from 'js-sha512';

function usernameInvalid(username: string) {
    const regex = /.{1,128}/;
    return !regex.test(username);
}

function passwordInvalid(password: string) {
    const regex = /.{1,128}/;
    return !regex.test(password);
}

export default function Login() {
    const navigator = useNavigation();

    const usernameElemRef = useRef({});

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [newUserPrompt, setNewUserPrompt] = useState(false);
    const [newUser, setNewUser] = useState(false);

    useEffect(() => {
        if (!newUser) return;
        

    }, [newUser]);

    useEffect(() => {
        if (!login) return;

        if (!username || !password) {
            setLoginError((!username ? 'Username' : 'Password') + ' is empty!');
            setLogin(false);
            return;
        }

        if (usernameInvalid(username) || passwordInvalid(password)) {
            setLoginError((!username ? 'Username' : 'Password') + ' is invalid!');
            setLogin(false);
            return;
        }

        const hash = sha512_256(username+password);
        FS.getInfoAsync(FS.cacheDirectory + hash+'.user').then((fileInfo) => {
            if (fileInfo.exists && !fileInfo.isDirectory) {
                console.log(FS.cacheDirectory + hash+'.user');
                FS.readAsStringAsync(FS.cacheDirectory + hash+'.user').then((data: string) => {console.log(data)});
            }
            else {
                setNewUserPrompt(true);
                console.log(FS.cacheDirectory + hash+'.user');
                FS.writeAsStringAsync(FS.cacheDirectory + hash+'.user','hello world');
                setLoginError('User not found!');
                setLogin(false);
            }
        });

        setLoginError('');
    }, [login]);

    console.log(newUserPrompt)
    return (
        <View style={[styles.flex, styles.background]}>

            {newUserPrompt && (()=>{Keyboard.dismiss(); return true;})() && <>
                <TouchableOpacity style={pageStyles.overlay} onPress={() => {console.log('fml I wanna die'); setNewUserPrompt(false)}} />
                <View style={[styles.flex, styles.container, {top: '16%', minHeight: 100, maxHeight: 160, width: '60%', zIndex: 11, borderRadius: 10}]}>
                    <Text style={[styles.largerText, {height: 'auto', marginTop: 6}]}>User not found!</Text>
                    <Text style={[styles.largeText, {height: 'auto', fontSize: 17, marginTop: 4}]}>Create new user?</Text>
                    <View style={[styles.flexRow, {maxHeight: '40%', marginBottom: 0, marginTop: 10}]}>
                        <TouchableOpacity style={[styles.button, {marginRight: 10}]} onPress={() => setNewUserPrompt(false)}><Text style={styles.text}>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setNewUser(true)}><Text style={styles.text}>Create</Text></TouchableOpacity>
                    </View>
                </View>
                </>
            }

            <Text style={styles.headerText}>Login</Text>

            <View style={{height: '1%'}}></View>

            {loginError && <Text style={[styles.text, styles.errorBox]}>{loginError}</Text>}

            <View style={{height: '1%'}}></View>

            <TextInput style={[styles.input, styles.text,]} ref={usernameElemRef} placeholder='Username' placeholderTextColor={'grey'} value={username} onChangeText={(e) => {setLoginError(''); setUsername(e)}}></TextInput>
            <TextInput style={[styles.input, styles.text]} placeholder='Password' placeholderTextColor={'grey'} value={password} onChangeText={(e) => {setLoginError(''); setPassword(e)}} secureTextEntry></TextInput>

            <View style={{height: '3%'}}></View>

            <TouchableOpacity style={styles.button} onPress={() => {setLogin(true)}}>
                {login ? <ActivityIndicator size='small' /> : <Text style={styles.text}>Login</Text>}
            </TouchableOpacity>
            <View style={{height: '20%'}}></View>
        </View>
    );
}

const pageStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 200,
        top: '100%',
        left: '2%',
        width: '45%',
        height: '350%',
        backgroundColor: '#001F3F',
        shadowColor: '#5A2D81',
        shadowRadius: 100,
        shadowOpacity: 300
    },
    overlay: {
        position: 'absolute',
        zIndex: 1,
        top: '-10%',
        left: 0,
        width: '100%',
        height: '1260%',
        backgroundColor: '#00000060'
    },
    menuItem: {
        color: '#ffffff',
        borderColor: '#00000000',
        borderTopColor: '#303030',
        borderWidth: 1,
        width: '100%',
        marginBottom: '5%'
    }
});
