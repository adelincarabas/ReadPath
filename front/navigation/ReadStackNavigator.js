import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { theme } from '../core/theme';

// Screen imports
import {
  ReadScreen
} from '../screens';

const Stack = createStackNavigator();

export default function ReadStackNavigator() {
  return (
    <Stack.Navigator screenOptions={theme.screenOptionStyle}>
      <Stack.Screen name="ReadScreen" component={ReadScreen} />
    </Stack.Navigator>
  );
}
