import React, { useState, useRef } from "react";
import { View, StyleSheet, ScrollView, Text, Pressable,
    SafeAreaView, TouchableOpacity} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";


import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import IconButton from "../components/atoms/IconButton";
import TextInput from "../components/atoms/TextInput";
import Header from "../components/atoms/Header";
import DropdownComponent from "../components/atoms/Dropdown";
import {
    actions,
    RichEditor,
    RichToolbar,
  } from "react-native-pell-rich-editor";

import { theme } from '../core/theme';
import Button from "../components/atoms/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WriteScreen ({ navigation }) {
    const [bookTitle, setBookTitle] = useState({ value: '', error: '' });
    const [bookTag, setBookTag] = useState({ value: '', error: '' });
    const [bookContent, setBookContent] = useState({ value: '', error: '' });
    const [uploadImage, setUploadImage] = useState("");
    const [showImgFlag, setShowImgFlag] = useState(false);

    // Flags used to display a message in case of empty/unselected tag/image
    const [tagErrorFlag, setTagErrorFlag] = useState(false);
    const [imgErrorFlag, setImgErrorFlag] = useState(false);
    const richText = useRef();

    const [descHTML, setDescHTML] = useState("");
    const [showDescError, setShowDescError] = useState(false);

    const richTextHandle = (descriptionText) => {
        if (descriptionText) {
        setShowDescError(false);
        setDescHTML(descriptionText);
        } else {
        setShowDescError(true);
        setDescHTML("");
        }
    };

    const submitContentHandle = () => {
        const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
        const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

        if (replaceWhiteSpace.length <= 0) {
        setShowDescError(true);
        } else {
        // send data to your server!
        }
    };

    // Set the new tag selected from the dropdown
    const setNewTag = (item) => {
        setBookTag({ value: item.value, error: '' });    
    }

    const handleAI = async () => {
        // const postData = {
        //     document: "Once upon a time, in a small village nestled amidst rolling hills, there lived a young shepherd named Benjamin. Benjamin tended to a flock of sheep with utmost care and love. Each day, he would lead them to lush meadows where they could graze and find shelter."
        //   };
          
        //   axios.post('https://api.gptzero.me/v2/predict/text', postData, {
        //     headers: {
        //       'accept': 'application/json',
        //       'Content-Type': 'application/json'
        //     }
        //   })
        //   .then((response) => {
        //     console.log(response.data);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
}

    // handler for the upload of book cover picture
    const handleUpload = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(permissionResult.granted === false) {
            alert("Camera access is required.");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [2, 3],
            base64: true,
        });

        if(pickerResult.cancelled === true) {
            return;
        }

        let base64Image = pickerResult.base64;
        setUploadImage(base64Image);
        setShowImgFlag(true);
    };


    const handleStoryPost = async () => {
        let storeData = await AsyncStorage.getItem("auth-rn");
        const parsed = JSON.parse(storeData);

        // Make sure that previous error messages disappear 
        // if the field is not empty, for tag or image
        setTagErrorFlag(false);
        setImgErrorFlag(false);

        // get the username
        let uid = parsed.user.id;

        // get the story title
        let title = bookTitle.value;

        // get the story genre tag
        let tag = bookTag.value;

        // get the story text
        let storyText = bookContent.value;

        // get the story cover 
        let img = uploadImage;

        // Error checks
        if(title === "" || title === null) {
            setBookTitle({ ...bookTitle, error: "Title must not be empty"});
            return;
        }

        // if(storyText === "" || storyText === null) {
        //     setBookContent({ ...bookContent, error: "Your story must not be empty"});
        //     return;
        // }

        if(tag === "" || tag === null) {
            setTagErrorFlag(true);
            return;
        }

        if(img === "" || img === null) {
            setImgErrorFlag(true);
            return;
        }

        // When using an android emulator with expo-go 
        // use localhost instead of localhost
        // NOTE: this post request will have to be placed at the end alongside other data
        try {
            let config = {
                validateStatus: function (status) {
                    return status <= 500; // Resolve only if the status code is <= than 500
                }
            }
            
        } catch(e) {
            console.log(e);
        }


        setTimeout(() => {
            navigation.navigate("WritePartsScreen", {
                title: title,
                description: descHTML,
                genre: tag,
                image: uploadImage,
                userID: parsed.user.username,
                reviews: {}
            });
        }, 500);
    }
    
    return (
        <DarkBackgroundS style={styles.backStyle}>
            <View style={styles.headerStyle}>
                <IconButton
                        icon="arrow-left"
                        iconColor={theme.colors.firstColors}
                        onPress={() => navigation.goBack()}
                        size={30}
                />

                <Header style={styles.titleStyle}> Your story </Header>
            </View>

            <ScrollView 
                style={styles.scrollStyle} 
                contentContainerStyle={styles.chldStyle}
                showsVerticalScrollIndicator={false}
            >
                <TextInput
                    label="Title"
                    returnKeyType="next"
                    value={bookTitle.value}
                    onChangeText={(text) => setBookTitle({ value: text, error: '' })}
                    error={!!bookTitle.error}
                    errorText={bookTitle.error}
                    style={styles.inputStyle}
                    theme={{
                        ...TextInput.theme, 
                        roundness: 15, 
                        colors: {text: theme.colors.text},
                    }}
                    activeOutlineColor={theme.colors.text}
                />
                
                {/* Box for user to write the story */}
                <Text style={styles.textStyle}> Write your story description below: </Text>
                 <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Pressable onPress={() => richText.current?.dismissKeyboard()}>
        </Pressable>
        <View style={styles.richTextContainer}>
          <RichEditor
            ref={richText}
            onChange={richTextHandle}
            placeholder=""
            androidHardwareAccelerationDisabled={true}
            style={styles.richTextEditorStyle}
            initialHeight={250}
          />
        </View>
        {showDescError && (
          <Text style={styles.errorTextStyle}>
            Your content shouldn't be empty 🤔
          </Text>
        )}

      </View>
    </SafeAreaView>

                <DropdownComponent setNewTag={(item) => setNewTag(item)}/>

                {tagErrorFlag? 
                    <Text style={{color: "red", paddingBottom: 10}}>
                        Your story must have a genre.
                    </Text> 
                    : ""
                }

                <Button 
                    style={styles.btnStyle} textStyle={styles.pictStyle}
                    onPress={handleUpload}> 
                    Upload cover picture 
                </Button>

                {showImgFlag? 
                    <Text style={{color: theme.colors.text, paddingBottom: 10}}>
                        Successfully uploaded image.
                    </Text> 
                    : ""
                }

                {imgErrorFlag? 
                    <Text style={{color: "red", paddingBottom: 10}}>
                        An image must be selected.
                    </Text> 
                    : ""
                }   

                {/* Button that posts the story */}
                <Button 
                    style={{ width: "50%"}}
                    onPress={handleStoryPost}>
                    POST
                </Button>
            </ScrollView>
        </DarkBackgroundS>
    );
}

const styles = StyleSheet.create({
    backStyle: {
        flex: 0,
        paddingTop: 20,
        width: '100%',
    },

    headerStyle: {
        flexDirection: "row",
        alignSelf: "flex-start"
    },

    titleStyle: {
        fontSize: 22,
        alignSelf: "center",
        textAlign: "right",
        paddingLeft: 55,
    },

    subtitleStyle: {
        fontSize: 19,
        alignSelf: 'stretch',
        paddingBottom: 5,
        marginBottom: 25,
        width: '100%',
        backgroundColor: theme.colors.darkPurple
    },

    inputStyle: {
        backgroundColor: "white",
        text: theme.colors.text,
    },

    contentBoxStyle: {
        backgroundColor: theme.colors.darkBox,
        text: theme.colors.text,
        height: 400,
    },

    scrollStyle: {
        centerContent: true
    },

    container: {
        flex: 1,
        width: "100%",
    },

    chldStyle: {
        alignItems: "center",
    },

    textStyle: {
        alignSelf: "flex-start",
        paddingLeft: 15,
        paddingTop: 15,
        fontSize: 25,
        color: theme.colors.text,
        paddingBottom: 20
    },

    pictStyle: {
        fontWeight: "normal",
        textTransform: 'uppercase'
    },

    richTextContainer: {
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        marginBottom: 10,
      },

    richTextEditorStyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        width: 400,
        borderColor: "#ccaf9b",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 4,
        fontSize: 20,
      },
});