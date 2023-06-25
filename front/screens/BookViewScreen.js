import React, {useState, useEffect, useContext} from "react";
import { View, StyleSheet, Text, ScrollView, useWindowDimensions } from "react-native";
import axios from "axios";

// Local atom imports
import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import IconButton from "../components/atoms/IconButton";
import Button from "../components/atoms/Button";
import Ruler from "../components/atoms/Ruler";

import { theme } from '../core/theme';
import { AuthContext } from "../context/auth";
import RenderHtml from 'react-native-render-html';


export default function BookViewScreen ({route, navigation}) {
    const [story, setStory] = useState("");
    const [savedFlag, setSavedFlag] = useState(false);
    const [showFlag, setShowFlag] = useState(true);
    const [state, setState] = useContext(AuthContext);
    const [text, setText] = useState(route.params.author);
    const [editButton, showEditButton] = useState(false);

    const source = {
        html: route.params.content
      };
    
      const { width } = useWindowDimensions();
      

    useEffect(() => {
        // Show the content of the story
        setStory(route.params.content);


        // Don't show the save button if the username is the same as 
        // the author of this book
        if(state.user.username === route.params.author) {
            setShowFlag(false);
            showEditButton(true);
        } else {
            // Check if the user already has the book in its library
            try {
                // Set the Save book button correspondingly
                isBookSaved();

                // Cannot add self views
                // Increase the view count
                addViews();
            } catch (e) {
                console.log(e);
            }
        }
    }, []);

    const addViews = async () => {
        try {
          const resp = await axios.post("http://localhost:8080/api/views", {
            title: route.params.title,
            views: route.params.views,
          });
        } catch (e) {
          console.log(e);
        }
    };

    // Return true if the book is saved
    // and false otherwise
    const isBookSaved = async () => {
        try {
          const resp = await axios.post("http://localhost:8080/api/isBookSaved", {
            title: route.params.title,
            userID: state.user.username,
          });

          setSavedFlag(resp.data.message);
        } catch (e) {
          console.log(e);
        }
    };

    const SaveBook = async () => {
        if (savedFlag === false) {
            // Save the book
            try {
              setSavedFlag(!savedFlag);

              const resp = await axios.post("http://localhost:8080/api/savedBooks", {
                userID: state.user.username,
                title: route.params.title,
              });

            } catch (e) {
              console.log(e);
            }
        } else {
            // Unsave the book
            setSavedFlag(!savedFlag);

            try {
              const resp = await axios.post(
                "http://localhost:8080/api/unsavedBooks",
                {
                  userID: state.user.username,
                  title: route.params.title,
                }
              );
            } catch (e) {
              console.log(e);
            }
        }
    };

    const Reviews = async () => {
        try {
            const resp = await axios.post("http://localhost:8080/api/getReviews",{
                title: route.params.title
            });
            let ratingsArray = resp.data.message.map(reviewItem => String(reviewItem.rating));
            ratingsArray.shift();
            let floatArray = ratingsArray.map(num => parseFloat(num));
            let sumReviews = 0;
            for(let i = 0; i < floatArray.length; i++){
                sumReviews += floatArray[i];
            }
            let overallScore = sumReviews / floatArray.length;
            navigation.navigate("ReviewsScreen", {title: route.params.title, author: route.params.author, reviews: resp.data.message, overallScore: overallScore});
             } catch (e) {
               console.log(e);
             }
    }

    const authorPage = async () => {
        try{
             const resp2 = await axios.get(
                "http://localhost:8080/api/isFollowing",
                {
                  params: {
                    userID: route.params.author,
                    myUserID: state.user.username
                  },
                }
              );
              let followedAlready = false;
              if(resp2.data.followers.includes(state.user.username)){
                followedAlready = true;
              }
        const resp = await axios.post("http://localhost:8080/api/getCustomUserData",{
                username: text
        });
        navigation.navigate("OtherProfileScreen", {
            username: resp.data.username,
            followedAlready: followedAlready
        });
    }catch(e){
            console.log(e)
        }
    }

    const readTheBook = async () => {
            const whatPage = await axios.get(
              "http://localhost:8080/api/getWhatPage",
              {
                params: {
                  userID: route.params.author,
                  title: route.params.title
                },
              }
            );

        const resp = await axios.post("http://localhost:8080/api/getBookByTitle",{
                title: route.params.title,
        });
        navigation.navigate("ReadBookScreen", {contentText: resp.data.contentParts, part: whatPage.data.part, author: route.params.author,
            title: route.params.title,
            views: route.params.views,
            content: route.params.content,
            tag: route.params.tag,
            contentParts: resp.data.contentParts});
    }

    const goBack = async () => {
        // if(route.params.otherProfile){
        //     try{
        //         const resp = await axios.post("http://localhost:8080/api/getCustomUserData",{
        //                 username: text
        //         });
        //         navigation.navigate("OtherProfileScreen", {
        //             username: resp.data.username
        //         });
        //         }catch(e){
        //             console.log(e);
        //         }
        // }else{
            navigation.goBack();
        // }
    }

    const editBook = () => {
        navigation.navigate("EditBookScreen", 
        {   contentText: route.params.contentParts,
            title: route.params.title
        });
    }

    return (
        <DarkBackgroundS>
            {/* Header and title parts */}
            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    <IconButton
                        icon="arrow-left"
                        iconColor={theme.colors.firstColors}
                        onPress={goBack}
                        size={30}
                    />

                    {showFlag? 
                        <View style={styles.saveBtn}>
                            <Button onPress={SaveBook}>
                                {savedFlag? <Text>Unsave</Text> : <Text>Save book</Text>}
                            </Button>
                        </View>
                        :
                        ""
                    }
                </View>
                    
                <Text style={[styles.info, {fontWeight: 'bold'}]}>{route.params.title}</Text>
                <Text style={[styles.info, {fontSize: 20, color: "#cccccc"}]} onPress={authorPage}>
                    Written by: {showFlag? route.params.author : "you"}
                </Text> 
            </View>

            <Ruler/>

            <ScrollView>
                <Text style={styles.description}>Description: </Text>
                <View style={styles.story}>
                    <RenderHtml
                style={styles.text}
                contentWidth={width}
                source={source}
                />
                </View>
                <Button style={styles.button} onPress={readTheBook}>
                    <Text>Read the book</Text>
                </Button>
                <Button style={styles.button}>
                    <Text onPress={Reviews}>Reviews</Text>
                </Button>
                {editButton? <View>
                            <Button style={styles.button} onPress={editBook}>
                                <Text>Edit book</Text>
                            </Button>
                        </View> : ""}
            </ScrollView>
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
        marginLeft: 200,
    },

    container: {
        backgroundColor: theme.colors.secondary,
        borderRadius: 15,
        paddingBottom: 20,
    },

    description: {
        color: "#64CCC5",
        paddingLeft: 20,
        paddingTop: 20,
        fontSize: 20
    },

    info: {
        alignSelf: "center",
        fontSize: 30,
        color: theme.colors.text,
        backgroundColor: 'transparent'
    },

    story: {
        backgroundColor: theme.colors.darkPurpleBox,
        borderRadius: 15,
        marginTop: 10,
        padding: 10,
        marginLeft: 15,
        marginRight: 15
    },

    storyText: {
        color: theme.colors.text,
        fontSize: 18,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    button: {
        marginLeft: 20,
    },
    text: {
        margin: 30,
        fontSize: 20
    }
});