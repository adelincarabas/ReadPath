import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import DarkBackground from "../components/atoms/DarkBackground";
import Button from "../components/atoms/Button";

export default function ComposeScreen () {
    const navigation = useNavigation();
    
    const composePressed = () => {
        navigation.navigate('WriteScreen');
    };

    return (
        <DarkBackground style={styles.backStyle}>
            <Button 
                style={styles.btnStyle}
                onPress={composePressed}>
                Create a new story    
            </Button>

            {/* <Button style={styles.btnStyle}>
                Edit an existing story
            </Button> */}
        </DarkBackground>
    );
}

const styles = StyleSheet.create({
    buttonsStyle: {
        width: "100%",
        alignSelf: 'center'
    },

    backStyle: {
        flex: 0,
        width: '100%',
    },

    btnStyle: {
        fontSize: 19,
        alignSelf: 'flex-start',
        paddingBottom: 5,
        marginBottom: 10,
        width: '100%',
        marginTop: 300
    }
});