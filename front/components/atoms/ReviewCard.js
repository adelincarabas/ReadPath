import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReviewCard = ({ name, review, rating }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.review}>{review}</Text>
      <Text style={styles.rating}>Rating: {rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)', // more transparent
    marginBottom: 20,
    marginLeft: 30, // smaller at sides
    marginRight: 30, // smaller at sides
    padding: 20,
    borderRadius: 10,
  },
  name: {
    color: 'white',
    marginBottom: 10,
    alignSelf: 'flex-end', // opposite side of the text of the review
  },
  review: {
    color: 'white',
    marginBottom: 10,
  },
  rating: {
    color: 'white',
  },
});

export default ReviewCard;