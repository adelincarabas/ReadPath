import React from "react";
import { Image } from "react-native-elements";
import { StyleSheet } from "react-native";

// Local atoms import
import Background from "../components/atoms/LoginBackground";
import Header from "../components/atoms/Header";
import Button from "../components/atoms/Button";
import { theme } from "../core/theme";

export default function StartScreen({ navigation }) {
    return (
        <Background>

            <Image source={require('../assets/images/ReadPath-logos_transparent.png')} style={styles.logoBox}>
            </Image>

            <Header>Your voice belongs on bookshelves</Header>
        
            <Button
                mode="contained"
                onPress={() => navigation.navigate('LoginScreen')}
            >
                Login
            </Button>
        
            <Button
                mode="outlined"
                onPress={() => navigation.navigate('RegisterScreen')}
                labelStyle={styles.labelButton}
                style={styles.secondButton}
            >
                Sign Up
            </Button>

      </Background> 
    );
}

const styles = StyleSheet.create({
    logoBox: {
        paddingTop: 20,
        width: 340,
        height: 300,
        marginBottom: 30,
    },

    logoStyle: {
        alignSelf: 'center',
        top: 70,
    },

    labelButton: {
        color: theme.colors.darkText
    },

    secondButton: {
        borderWidth: 1,
    }
});