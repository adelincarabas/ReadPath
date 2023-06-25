import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Pressable,
    SafeAreaView, TouchableOpacity, FlatList} from "react-native";
import {
    actions,
    RichEditor,
    RichToolbar,
  } from "react-native-pell-rich-editor";
import axios from "axios";
import IconButton from "../components/atoms/IconButton";
import { theme } from "../core/theme";
import Button from "../components/atoms/Button";


export default function EditBookScreen ({ route, navigation }) {
    const richText = useRef();
    const [descHTML, setDescHTML] = useState(Object.values(route.params.contentText).join(" "));
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


    const submitContentHandle = async() => {
        const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
        const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

        if (replaceWhiteSpace.length <= 0) {
        setShowDescError(true);
        } else {
          console.log(route.params);
         const resp = await axios.post("http://localhost:8080/api/editBook", {
                title: route.params.title,
                contentParts: descHTML
            });

            navigation.goBack();
            navigation.goBack();
            alert("Book has been published");
        
        }
    };

    const handleHead2 = ({tintColor}) => <Text style={{color: tintColor, fontSize: 20}}>A^</Text>
    const handleHead = ({tintColor}) => <Text style={{color: tintColor, fontSize: 20}}>a^</Text>
    const handleHead3 = ({tintColor}) => <Text style={{color: tintColor, fontSize: 20}}>C</Text>
    return (
        <ScrollView style ={styles.scrollStyle}>
        <View style={styles.container}>
        <SafeAreaView edges={["bottom", "left", "right"]} style={{ flex: 1 }}>
        <View style={styles.buttons}>
        <IconButton
                        icon="arrow-left"
                        iconColor="black"
                        onPress={() => navigation.goBack()}
                        size={30}
                        style={styles.backButton}
                    />
        <Button style={styles.button1}>{route.params.title}</Button>
        <Button onPress={submitContentHandle}>Publish</Button>
        </View>
      <View style={styles.container}>

        <Pressable onPress={() => richText.current?.dismissKeyboard()}>
        </Pressable>
        <RichToolbar
            editor={richText}
            selectedIconTint="#873c1e"
            iconTint="#312921"
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertLink,
              actions.setUnderline,
              actions.heading3,
              actions.heading1,
            ]}
            iconMap={{ [actions.heading1]: handleHead, [actions.heading3]: handleHead2, [actions.justifyCenter]: handleHead3 }}
            style={styles.richTextToolbarStyle}
          />
        <ScrollView contentContainerStyle={styles.richTextContainer}>
          <RichEditor
            ref={richText}
            onChange={richTextHandle}
            placeholder="Write your cool content here :)"
            androidHardwareAccelerationDisabled={false}
            style={styles.richTextEditorStyle}
            initialHeight={250}
            initialContentHTML={descHTML} 
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
      height:800,
      marginBottom: 0,
      marginTop: 0,
    },
    text: {
      color: 'black',
      padding: 100,
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
      padding: 10, 
       margin: 0,
    },
    buttons : {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width:"30%"
    },
    button1: {
      marginLeft: "75%",
      marginRight: 40,
    },
    backButton: {
      paddingTop: 15,
      paddingLeft: 15
    }
  });