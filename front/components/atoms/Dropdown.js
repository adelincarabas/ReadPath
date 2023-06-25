import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { theme } from '../../core/theme';

const data = [
    { label: 'Action', value: 'Action' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Poetry', value: 'Poetry' },
    { label: 'S.F.', value: 'S.F.' },
];

export default function DropdownComponent({ ...props }) {
    const [tag, setTag] = useState({ value: '', error: '' });
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.tStyle}> CHOOSE TAG </Text>

            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={tag.value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={props.setNewTag}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.secondary,
        padding: 16,
        borderRadius: 15,
        width: "90%",
        alignItems: "flex-start",
        marginTop: 10,
        marginBottom: 10,
    },

    dropdown: {
        height: 26,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: "100%",
        backgroundColor: "#64CCC5",
        height: 50
    },

    icon: {
        marginRight: 5,
    },

    placeholderStyle: {
        fontSize: 16,
    },
    
    selectedTextStyle: {
        fontSize: 16,
    },

    iconStyle: {
        width: 20,
        height: 20,
    },

    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

    tStyle: {
        fontSize: 20,
        lineHeight: 21,
        marginBottom: 10,
        alignSelf: "flex-start",
        color: "#64CCC5",
    }
});