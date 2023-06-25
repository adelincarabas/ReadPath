import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { theme } from '../core/theme';

// Screen imports
import {
  HomeScreen
} from '../screens';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={theme.screenOptionStyle}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}