import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton as PaperButton } from 'react-native-paper';
import { theme } from '../../core/theme';

export default function IconButton({ mode, style, ...props }) {
    return (
        <PaperButton
            style={[
                styles.button,
                mode === 'outlined' && { backgroundColor: theme.colors.background},
                style
            ]}
            labelStyle={styles.text}
            mode={mode}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    button: {
        shadowColor: 'black',
    },
    
    text: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 26,
    }, 
});