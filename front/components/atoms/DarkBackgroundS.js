import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';

import { theme } from '../../core/theme';

export default function DarkBackgroundS({ children }) {
    return (
        <ImageBackground
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                {children}
            </SafeAreaView>
    
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        maxWidth: 450,
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.secondary,
    },

    container: {
        flex: 1,
        paddingTop: 25,
        padding: 10,
        width: '100%',
        maxWidth: 450,
    }
});