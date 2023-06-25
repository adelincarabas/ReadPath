import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Pressable,
    SafeAreaView, SectionList} from "react-native";
import {
    actions,
    RichEditor,
    RichToolbar,
  } from "react-native-pell-rich-editor";
import axios from "axios";
import IconButton from "../components/atoms/IconButton";
import HomeButton from '../components/atoms/HomeButton';
import Button from "../components/atoms/Button";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


export default function ReadBookScreen ({ route, navigation }) {
    const richText = useRef();
    const [descHTML, setDescHTML] = useState(route.params.contentText[route.params.part]);
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

    const changePart = async() => {
      console.log("aaaa");
      try {
        const resp = await axios.get(
          "http://localhost:8080/api/nextPart",
          {
            params: {
              userID: route.params.author,
              title: route.params.title,
              part: route.params.part + 1,
            },
          }
        );
        console.log(resp.data);
      } catch (e) {
        console.log(e);
      }

        if(route.params.contentText.length - 1 > route.params.part){
            navigation.push("ReadBookScreen", {contentText: route.params.contentText, 
                part: route.params.part + 1,
                author: route.params.author,
                title: route.params.title,
                views: route.params.views,
                content: route.params.content,
                tag: route.params.tag,
                contentParts: route.params.contentParts});
        }else{
            console.log("nu se poate");
        }
    }

    const onSwipeLeft = () => {
        changePart();
      }

    const onSwipeRight = () => {
        backButton();
    }

    const pressHome = () => {
      navigation.navigate("BookViewScreen", {
        author: route.params.author,
        title: route.params.title,
        views: route.params.views,
        content: route.params.content,
        tag: route.params.tag,
        contentParts: route.params.contentParts
      });
    }

    const backButton = () => {
        if(route.params.part == 0){
            navigation.navigate("BookViewScreen", {
                author: route.params.author,
                title: route.params.title,
                views: route.params.views,
                content: route.params.content,
                tag: route.params.tag,
                contentParts: route.params.contentParts
              });
        }else{
            console.log(route.params.title);
            navigation.push("ReadBookScreen", 
            {   contentText: route.params.contentText, 
                part: route.params.part - 1 ,
                author: route.params.author,
                title: route.params.title,
                views: route.params.views,
                content: route.params.content,
                tag: route.params.tag,
                contentParts: route.params.contentParts});
        }
    }

    return (
        <ScrollView
        style={styles.scrollStyle} 
        contentContainerStyle={styles.chldStyle}
        showsVerticalScrollIndicator={false}
        >
        <View style={{flex: 1}}>
        <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        style={{flex: 1}}
      >    
        <View style={styles.container}>
        <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
        <View style={styles.buttons}>
        <IconButton
                        icon="arrow-left"
                        iconColor="black"
                        onPress={backButton}
                        size={30}
                        style={styles.backButton}
                    />
        <HomeButton style={styles.homeButton} onPress={pressHome} />
        <Button style={styles.button1}>{route.params.title} - {route.params.part+1}</Button>
        {route.params.part < route.params.contentText.length - 1 && (
        <Button onPress={changePart} style={styles.button2}>Next Page</Button>
        )}
        </View>
      <View style={styles.container}>

        <Pressable onPress={() => richText.current?.dismissKeyboard()}>
          {/* <Text style={styles.headerStyle}>Your awesome Content</Text>
          <View style={styles.htmlBoxStyle}>
            <Text>{descHTML}</Text>
          </View> */}
        </Pressable>
        <ScrollView contentContainerStyle={styles.richTextContainer}>
  <RichEditor
    ref={richText}
    onChange={richTextHandle}
    placeholder="Write your cool content here :)"
    androidHardwareAccelerationDisabled={true}
    style={styles.richTextEditorStyle}
    initialContentHTML={descHTML}
    initialHeight={250}
    disabled={true}
    scrollEnabled={true}
  />
</ScrollView>
        {showDescError && (
          <Text style={styles.errorTextStyle}>
            Your content shouldn't be empty 🤔
          </Text>
        )}
      </View>
    </SafeAreaView>
        </View>
        {/* <BottomTabNavigator></BottomTabNavigator> */}
        </GestureRecognizer>
        </View>
       </ScrollView>
      );
}

const styles = StyleSheet.create({
    scrollStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
      backgroundColor: 'white',
      height: 800,
      marginBottom: 0,
      marginTop: 0,
    },
    homeButton: {
      paddingTop: 30
    },
    text: {
      color: 'black',
      fontSize: 30,
    },
    richTextContainer: {
        flex: 1,
      },
      richTextEditorStyle: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccaf9b",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 4,
        fontSize: 20,
        padding: 10, // Check if you have this padding
         margin: 0, // Make sure margin is set to 0
      },
    buttons : {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width:"30%"
    },
    button1: {
      marginLeft: 30,
      marginRight: 20,
      width: 170
    },
    button2: {
      width: 100
    },
    backButton: {
      paddingTop: 15,
      paddingLeft: 15
    }
  });