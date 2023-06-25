import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../../core/theme'; 

export default function TextInput({ errorText, description, ...props }) {
    return (
        <View style={styles.container}>
            <Input
                activeOutlineColor={theme.colors.primary}
                style={styles.input}
                selectionColor={theme.colors.primary}
                mode="outlined"
                theme={{
                    ...TextInput.theme, 
                    roundness: 15, 
                    colors: { text: theme.colors.darkText }
                }}
                underlineColor="transparent"
                {...props}
            />

            {/* If no error, then print the normal description */}
            {description && !errorText ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}    
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginVertical: 12,
    },
    
    input: {
        backgroundColor: theme.colors.firstColors,
        color: "red"
    },
    
    description: {
        fontSize: 13,
        color: theme.colors.secondary,
        paddingTop: 8,
    },
    
    error: {
        fontSize: 13,
        color: theme.colors.error,
        paddingTop: 8,
    },
});