import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { theme } from '../core/theme';

// Screen imports
import {
  ComposeScreen
} from '../screens';

const Stack = createStackNavigator();

export default function ComposeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={theme.screenOptionStyle}>
      <Stack.Screen name="ComposeScreen" component={ComposeScreen} />
    </Stack.Navigator>
  );
}
