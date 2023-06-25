import React from 'react';
import { Provider } from 'react-native-paper';
import { theme } from './core/theme';

import Navigation from './navigation/AppNavigation';

// for Login and Register screens
export default function App() {
    return (
        <Provider theme={theme}>
          <Navigation />
        </Provider>
    );
} 