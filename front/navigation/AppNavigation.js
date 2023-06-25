import { NavigationContainer } from "@react-navigation/native";
import React from "react";

import { AuthProvider } from "../context/auth";
import { BookProvider } from "../context/book";
import NavigationScreen from "../screens/NavigationScreen";

export default function Navigation() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <BookProvider>
                    <NavigationScreen/>
                </BookProvider>
            </AuthProvider>
        </NavigationContainer>
    );
}