import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';
import { StyleSheet } from "react-native";
import axios from "axios";

import { theme } from "../core/theme";

// Local navigator imports
import ComposeStackNavigator from "./ComposeStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import SearchStackNavigator from "./SearchStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";
import ReadStackNavigator from "./ReadStackNavigator";  

// Local atoms import
import IconButton from '../components/atoms/IconButton';

// local context import 
import { AuthContext } from "../context/auth";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }) {
    const [state, setState] = useContext(AuthContext);

    const onLogOutPressed = async () => {
        setState({ token: "", user: null });
        await AsyncStorage.removeItem("auth-rn");
    };

    return (
      <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            headerRight: () => (
                <IconButton
                      icon="logout"
                      iconColor={theme.colors.firstColors}
                      onPress={onLogOutPressed}
                />
            ),
            tabBarStyle: {
              backgroundColor: '#64CCC5', 
            },
          }}
          tabBarIcon={{
            focused: true,
            color: theme.colors.dark
          }}
      >

          {/* Configuration for the Home tab */}
          <Tab.Screen 
              name="Home" 
              component={HomeStackNavigator} 
              options={{
                headerTitleStyle: { fontSize: 20 },
                headerStyle: styles.headerStyle,
                headerTintColor: theme.colors.text,
                tabBarLabel: "Home",
                tabBarShowLabel: false,
                tabBarIcon: ({ color }) => {
                  return <Feather name="home" color={color} size={26} />
                },
                unmountOnBlur: true
              }}
          />

          {/* Configruation for the Search tab */}
          <Tab.Screen 
              name="Search" 
              component={SearchStackNavigator}
              options={{
                headerTitleStyle: { fontSize: 20 },
                headerStyle: styles.headerStyle,
                headerTintColor: theme.colors.text,
                tabBarLabel: "Search",
                tabBarShowLabel: false,
                tabBarIcon: ({ color }) => {
                  return <Feather name="search" color={color} size={26} />
                },
              }}
          />

          {/* Configuration for the Compose tab */}
          <Tab.Screen 
              name="Compose" 
              component={ComposeStackNavigator}
              options={{
                headerTitleStyle: { fontSize: 20 },
                headerStyle: styles.headerStyle,
                headerTintColor: theme.colors.text,
                tabBarLabel: "Compose",
                tabBarShowLabel: false,
                tabBarIcon: ({ color }) => {
                  return <Feather name="edit-2" color={color} size={26} />
                },
              }} 
          />

          {/* Configuration for the Read tab */}
          <Tab.Screen 
              name="Virtual Bookshelf" 
              component={ReadStackNavigator}
              options={{
                headerTitleStyle: { fontSize: 20 },
                headerStyle: styles.headerStyle,
                headerTintColor: theme.colors.text,
                tabBarLabel: "Virtual Bookshelf",
                tabBarShowLabel: false,
                tabBarIcon: ({ color }) => {
                  return <Feather name="book-open" color={color} size={26} />
                },
                unmountOnBlur: true
              }} 
          />

          {/* Configuration for the Profile tab */}
          <Tab.Screen 
              name="Profile" 
              component={ProfileStackNavigator}
              options={{
                headerTitleStyle: { fontSize: 20 },
                headerStyle: styles.headerStyle,
                headerTintColor: theme.colors.text,
                tabBarLabel: "Profile",
                tabBarShowLabel: false,
                tabBarIcon: ({ color }) => {
                  return <Feather name="user" color={color} size={26} />
                },
                unmountOnBlur: true
              }} 
          />
      </Tab.Navigator>
    );
};


const styles = StyleSheet.create({
  headerStyle: {
      backgroundColor: theme.colors.secondary,
      borderBottomWidth: 0.2,
      borderColor: theme.colors.borderColor,
  },
})