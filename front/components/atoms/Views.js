import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import IconButton from "./IconButton";

import { theme } from '../../core/theme';

export default function Views({ ...props }) {
    return (
        <View style={{flexDirection: "row"}}>
            <IconButton 
                icon="eye" 
                size={22}
                color="#FF0000"
            />

            <Text style={styles.viewText} {...props}/>
        </View>
    );
}

const styles = StyleSheet.create({
    viewText: { fontSize: 20, color: "#64CCC5", marginTop: 7,paddingTop: 5},
});