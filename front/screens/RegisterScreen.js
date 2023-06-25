import React, { useState} from "react";
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import axios from 'axios';

import { theme } from "../core/theme"; 

// Local atoms import 
import Background from "../components/atoms/LoginBackground";
import BackButton from "../components/atoms/BackButton";
import TextInput from "../components/atoms/TextInput";
import Header from "../components/atoms/Header";
import Button from "../components/atoms/Button";

// utils import
import { emailValidator } from '../utils/emailValidator';
import { passwordValidator } from '../utils/passwordValidator';
import { nameValidator } from '../utils/nameValidator';


export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [repeatedPassword, setRepeatedPassword] = useState({ value: '', error: '' });

    const onRegisterPressed = async () => {

        if(password.value !== repeatedPassword.value) {
            setRepeatedPassword({ ...repeatedPassword, error: "Passwords do not match"});
            return;
        }

        const usernameError = nameValidator(username.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);

        if (emailError || passwordError || usernameError) {
          setUsername({ ...username, error: usernameError });
          setEmail({ ...email, error: emailError });
          setPassword({ ...password, error: passwordError });
          return;
        }

        try {
            var signup_data = {
                username: username.value,
                email: email.value,
                password: password.value,
                roles: ["user"],
                savedBooksArray: [],
                followers: [],
                following: []
            };
            
            let response;
            let config = {
                validateStatus: function (status) {
                    return status < 500;
                }
            }
            
            // When using an android emulator with expo-go 
            // use 10.0.2.2 instead of localhost
            await axios
                .post("http://localhost:8080/api/auth/signup", signup_data, config)
                .then((res) => {
                    if(JSON.stringify(res.status) === "400") {
                        response = res.data.message;
                    } else {
                        response = JSON.stringify(res.data);
                    }
                })
                .catch((err) => {
                    response = err.response.data.message;
                });
            
            if (response === "Failed! Username is already in use!") {
                setUsername({ ...username, error: "This username already exists" });
            } else if (response === "Failed! Email is already in use!") {
                setEmail({ ...email, error: "An account already uses this email" });
            } else {
                alert("Sign Up was successful!\nYou can log in now to start using the app.");

                navigation.reset({
                    index: 0,
                    routes: [{ name: "StartScreen" }],
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Header>Register Here</Header>

            {/* Username text input */}
            <TextInput
                label="Username"
                returnKeyType="next"
                value={username.value}
                onChangeText={(text) => setUsername({ value: text, error: '' })}
                error={!!username.error}
                errorText={username.error}
                autoCapitalize="none"
            />

            {/* Email text input */}
            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            {/* Password text input */}
            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />

            {/* Password confirmation text input */}
            <TextInput
                label="Confirm Password"
                returnKeyType="done"
                value={repeatedPassword.value}
                onChangeText={(text) => setRepeatedPassword({ value: text, error: '' })}
                error={!!repeatedPassword.error}
                errorText={repeatedPassword.error}
                secureTextEntry
            />
            
            <Button
                mode="contained"
                onPress={onRegisterPressed}
                style={{ marginTop: 24 }}
            >
                Sign Up
            </Button>

            {/* Link to the Login page */}
            <View style={styles.row}>
                <Text style={styles.textBeforeLink}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>

        </Background>
    );
}

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
})