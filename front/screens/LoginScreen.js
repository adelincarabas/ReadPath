import React, { useState, useContext } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { theme } from '../core/theme';

// Local atoms
import Button from '../components/atoms/Button';
import TextInput from '../components/atoms/TextInput';
import Background from '../components/atoms/LoginBackground';
import Header from '../components/atoms/Header';
import BackButton from '../components/atoms/BackButton';

// Utils import
import { emailValidator } from '../utils/emailValidator';
import { passwordValidator } from '../utils/passwordValidator';

// context import 
import { AuthContext } from "../context/auth";

export default function LoginScreen({ navigation }) {
    const [userEmail, setUserEmail] = useState({ value: "", error: "" });
    const [userPassword, setUserPassword] = useState({ value: "", error: "" });
    const [state, setState] = useContext(AuthContext);
    
    const onLoginPressed = async () => {
        const emailError = emailValidator(userEmail.value);
        const passwordError = passwordValidator(userPassword.value);

        if (emailError || passwordError) {
            setUserEmail({ ...userEmail, error: emailError });
            setUserPassword({ ...userPassword, error: passwordError });
            return;
        }

        try {
            var signin_data = {
              email: userEmail.value,
              password: userPassword.value,
              roles: ["user"],
            };

            let response;
            let config = {
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            }
            
            // When using an android emulator with expo-go 
            // use localhost instead of localhost
            await axios
                .post("http://localhost:8080/api/auth/signin", signin_data, config)
                .then((res) => {
                    if(JSON.stringify(res.status) === "401") {
                        response = res.data.message;
                    } else {
                        response = JSON.stringify(res.data);
                    }
                })
                .catch((err) => {
                    if(err.response) {
                        console.log(err.response);
                    } else if(err.request) {
                        console.log(err.request);
                    } else {
                        console.log('Error:', err.message);
                    }

                    console.log(err.config);
                    response = null;
                });
    
            if (response === "User Not found.") {
                setUserEmail({ ...userEmail, error: "No account exists with this email" });
            } else if (response === "Invalid Password!") {
                setUserPassword({ ...userPassword, error: "Incorrect password" });
            } else if( response != null) {
                setState(JSON.parse(response));
                await AsyncStorage.setItem("auth-rn", response);
            }
        } catch (err) {
            console.log('Signin error:', err);
        }
    };
    
    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Header>Welcome Back</Header>

            {/* Email input text box */}
            <TextInput
                label="Email"
                returnKeyType="next"
                value={userEmail.value}
                onChangeText={(text) => setUserEmail({ value: text, error: ''})}
                error={!!userEmail.error}
                errorText={userEmail.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            {/* Password input text box */}
            <TextInput
                label="Password"
                returnKeyType="done"
                value={userPassword.value}
                onChangeText={(text) => setUserPassword({ value: text, error: '' })}
                error={!!userPassword.error}
                errorText={userPassword.error}
                secureTextEntry
            />

            <Button mode="contained" onPress={onLoginPressed}>
                Login
            </Button>

            {/* Link to the Login page */}
            <View style={styles.row}>
                <Text style={styles.textBeforeLink}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
                    <Text style={styles.link}>Register</Text>
                </TouchableOpacity>
            </View>

        </Background>
    )
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },

    textBeforeLink: {
        color: theme.colors.darkText,
    },

    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});