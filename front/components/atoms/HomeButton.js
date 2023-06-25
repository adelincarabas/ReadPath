import React from 'react';
import { Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeButton = ({ onPress }) => (
  <Pressable onPress={onPress} style={{ padding: 10, paddingTop:21,paddingLeft: 10, borderRadius: 5}}>
    <Icon name="home" size={30} />
  </Pressable>
);

export default HomeButton;