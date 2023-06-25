import React from "react";
import { StyleSheet, View } from "react-native";

import { theme } from '../../core/theme';

export default function Ruler() {
    return (
        <View>
            <View style={styles.rulerStyle}/>
            <View style={styles.rulerStyle2}/>
        </View>
    );
}

const styles = StyleSheet.create({
    rulerStyle: {
        borderBottomColor: 'white',
        paddingBottom: 2,
        borderRadius: 45,
        borderBottomWidth: 1,
    },

    rulerStyle2: {
        borderBottomColor: theme.colors.primary,
        paddingBottom: 2,
        borderBottomWidth: 3,
        borderRadius: 45,
    },
});