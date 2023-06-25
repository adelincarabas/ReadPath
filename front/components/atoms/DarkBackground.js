import React from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { theme } from '../../core/theme';

export default function DarkBackground({ style, children }) {
    return (
    <ImageBackground
        style={styles.background}
    >
        <KeyboardAvoidingView style={[styles.container, style]} behavior="padding">
            {children}
        </KeyboardAvoidingView>
    </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.secondary,
    },
      
    container: {
        flex: 1,
        padding: 10,
        width: '100%',
        maxWidth: 450,
    },
});