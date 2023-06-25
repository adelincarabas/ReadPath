import React, {useState, useEffect, useContext} from "react";
import { View, StyleSheet, Text, ScrollView, useWindowDimensions } from "react-native";
import axios from "axios";

// Local atom imports
import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import IconButton from "../components/atoms/IconButton";
import ReviewCard from "../components/atoms/ReviewCard";
import Button from "../components/atoms/Button";


import { theme } from '../core/theme';

export default function ReviewsScreen ({route, navigation}) {
    const WriteReview = () => {
        navigation.navigate("WriteReviewScreen", {title: route.params.title, author: route.params.author});
    }
  
    return (
        <DarkBackgroundS>
            <IconButton
                    icon="arrow-left"
                    iconColor={theme.colors.firstColors}
                    onPress={() => navigation.goBack()}
                    size={30}
            />
            <Text style={styles.text}>{isNaN(route.params.overallScore) ? 'No reviews yet' : `Overall Score: ${route.params.overallScore}`}</Text>
            <ScrollView>
            {route.params.reviews.map((reviewItem, index) => (
                index !== 0 && <ReviewCard key={index} name={reviewItem.reviewer} review={reviewItem.comment} rating={reviewItem.rating} />
            ))}
            </ScrollView>
            <Button 
                    style={{backgroundColor: theme.colors.secondary, width: "80%", marginLeft: 40}}
                    onPress={WriteReview}
                    >
                    REVIEW
                </Button>
        </DarkBackgroundS>
    );
}

const styles = StyleSheet.create({
    headerStyle: {
        flex: 0,
        flexDirection: "row",
    },

    saveBtn: {
        width: "40%",
        alignSelf: "stretch",
        marginLeft: 150,
    },

    container: {
        backgroundColor: theme.colors.darkBox,
        borderRadius: 15,
        paddingBottom: 20
    },

    info: {
        alignSelf: "center",
        fontSize: 20,
        color: theme.colors.text,
    },

    story: {
        backgroundColor: theme.colors.darkPurpleBox,
        borderRadius: 15,
        marginTop: 10,
    },

    storyText: {
        color: theme.colors.text,
        fontSize: 18,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    text: {
        color: theme.colors.text,
        flex: 1,
        alignSelf: "center",
        fontSize:30
    }
});