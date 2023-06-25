import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

// local components import
import Shelf from "../atoms/Shelf";
import Views from "../atoms/Views";

import { theme } from '../../core/theme';

export default function BookView({ style, imgData, NbViews, bookTitle, bookTag, bookAuthor }) {
    return (
        <View style={[styles.bookStyle, style]}>
            <View style={{flex: 6}}>
                <Shelf/>
                <Image style={styles.bookCover} 
                    source={{uri: `data:image/jpeg;base64,${imgData}`}}/>
            </View>

            <View style={{flex: 7}}>
                {/* Here would go the Information */}
                <View style={styles.bookInfo}>
                    <Text style={styles.infoTitle} numberOfLines={1}>
                        {bookTitle}
                    </Text>

                    <Text style={styles.infoAuthor} numberOfLines={1}>
                        By {bookAuthor}
                    </Text>

                </View>
                
                <View style={{ alignSelf: "flex-end", flexDirection: "column-reverse", width: "60%"}}>
                    <Views>
                        {NbViews}
                    </Views>

                    <View style={styles.container}>
                        <Text style={styles.info} numberOfLines={1}>
                            {bookTag}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bookCover: { height: 165, width: 110, borderRadius: 4},
    bookStyle: { paddingBottom: 25, flexDirection: "row", paddingLeft: 10},
    bookInfo: { padding: 5, marginTop: 30, flex: 2}, 
    info: {color: theme.colors.text, alignSelf: "center" },
    infoTitle: { color: theme.colors.text, fontWeight: 'bold', fontSize: 18},
    infoAuthor: {color: "#cccccc", fontSize: 15, marginBottom: 25},
    container: {    
        backgroundColor: theme.colors.darkPurpleBox,
        borderRadius: 15,
        padding: 5, 
    },
});