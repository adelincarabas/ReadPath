import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { theme } from '../core/theme';

// Screen imports
import {
  ProfileScreen
} from '../screens';

const Stack = createStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={theme.screenOptionStyle}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
