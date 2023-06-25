import React from "react";
import { StyleSheet, View } from "react-native";

import { theme } from '../../core/theme';

export default function Shelf({style}) {
    return (
        <View style={[styles.shelf, style]}>
            <View style={styles.trapezoid}/>
            <View style={styles.rectange}/>
        </View>
    );
}

const styles = StyleSheet.create({
    trapezoid: {
        width: 150,
        height: 0,
        borderBottomWidth: 20,
        borderBottomColor: theme.colors.darkPurpleBox,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderStyle: "solid",
    },

    rectange: {
        height: 8,
        width: 150,
        backgroundColor: "#333333",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },

    shelf: {
        left: -20,
        top: 182,
        opacity: 0.5,
        elevation: 1,
    },
});