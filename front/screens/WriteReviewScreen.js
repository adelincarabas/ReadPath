import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import axios from 'axios';


import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import IconButton from "../components/atoms/IconButton";
import Button from "../components/atoms/Button";

import { theme } from '../core/theme';


const WriteReviewScreen = ({route, navigation}) => {
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [hasExceededMax, setHasExceededMax] = useState(false);

  const sendReview = async () => {
    try {
      const resp = await axios.post("http://localhost:8080/api/postReview", { params : {
        title: route.params.title,
        rating: number,
        description: description,
        author: route.params.author
      }});

      goBack();

    } catch (e) {
      console.log(e);
    }
  };

  const handleDescriptionChange = (text) => {
      if (text.length <= 300) {
        setDescription(text);
        setHasExceededMax(false);
      } else {
        setDescription(text)
        setHasExceededMax(true);
      }
  };

  const goBack = async() => {
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
  }

  return (
    <DarkBackgroundS>
    <IconButton
                icon="arrow-left"
                iconColor={theme.colors.firstColors}
                onPress={goBack}
                size={30}
        />
    <View style={styles.container}>
        <TextInput
            keyboardType="numeric"
            placeholder="Enter a number (1-10)"
            value={number}
            onChangeText={(text) => {
                const regex = /^([1-9](\.\d{0,1})?|10(\.0)?)$/;
                if (regex.test(text) || text === '') {
                    setNumber(text);
                }
            }}
            style={styles.input}
        />
      <TextInput
        autoCorrect={false}
        autoCompleteType={'off'}
        placeholder="Enter a description"
        value={description}
        onChangeText={handleDescriptionChange}
        style={styles.input2}
        multiline={true}
        />
        {hasExceededMax && <Text style={styles.warningText}>You have exceeded the maximum capacity of 300 characters.</Text>}
      <Button onPress={sendReview} disabled={hasExceededMax} >Send Review</Button>
    </View>
    </DarkBackgroundS>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: "#64CCC5",
    fontSize:30,
    height: 50
  },
  input2: {
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: "#64CCC5",
    fontSize:30,
    height: 'auto', // Auto height based on content
    },
    warningText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
      },
});

export default WriteReviewScreen;