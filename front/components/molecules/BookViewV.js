import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

// local components import
import Shelf from "../atoms/Shelf";
import Views from "../atoms/Views";

import { theme } from '../../core/theme';

export default function BookViewV({ style, imgData, NbViews, bookTitle, bookTag, bookAuthor }) {
    return (
        <View style={[styles.bookStyle, style]}>
            <View>
                <Shelf/>
                <Image style={styles.bookCover} 
                    source={{uri: `data:image/jpeg;base64,${imgData}`}}/>
            </View>

            {/* Here would go the Information */}
            <View style={styles.bookInfo}>
                <Text style={styles.infoTitle} numberOfLines={2}>
                    {bookTitle}
                </Text>

                <Text style={styles.infoAuthor} numberOfLines={1}>
                    By {bookAuthor}
                </Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    bookCover: { height: 165, width: 110, borderRadius: 4},
    bookStyle: { paddingBottom: 10, flexDirection: "column", marginLeft: 20, marginBottom: 25},
    bookInfo: { padding: 5, marginTop: 17, maxWidth: "80%"}, 
    info: {color: theme.colors.text, alignSelf: "center" },
    infoTitle: { color: theme.colors.text, fontWeight: 'bold', fontSize: 18, flex: 1, maxWidth: "70%" },
    infoAuthor: { color: "#cccccc", fontSize: 15},
    container: {    
        backgroundColor: theme.colors.darkPurpleBox,
        borderRadius: 15,
        padding: 3, 
    },
});