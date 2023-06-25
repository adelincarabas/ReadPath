import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../core/theme';

export default function Background({ children }) {
    return (
    <ImageBackground
        style={styles.background}
    >

        <ScrollView style={styles.scrollStyle} contentContainerStyle={styles.container}>
            {children}
        </ScrollView>

    </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.primaryBackground,
    },

    scrollStyle: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },

    container: {
        paddingTop: 80,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
});