import React, { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, setState] = useState({user: null, token: ""});

    // navigation
    const navigation = useNavigation();

    // config axios
    const token = state && state.token? state.token : "";
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // handle expired token or 401 error
    axios.interceptors.response.use(
        async function (response) {
            return response;
        },
        async function (error) {
            let res = error.response;

            if(res.status === 401 && res.config && !res.config.__isRetryRequest) {
                await AsyncStorage.removeItem("auth-rn");
                setState({ user: null , token: ""});
                navigation.navigate("StartScreen");
            }
        }
    );

    useEffect(() => {
        try {
            const loadFromAsyncStorage = async() => {
                let data = await AsyncStorage.getItem("auth-rn");

                if(data === "undefined") {
                    return;
                }

                const parsed = JSON.parse(data);

                if(parsed === null) {
                    console.log("parsed is null");
                    return;
                } else {
                    setState({ ...state, 
                                user: {
                                    id: parsed.user.id,
                                    username: parsed.user.username,
                                    email: parsed.user.email
                                }, 
                                token: parsed.token,});
                }
            };
    
            loadFromAsyncStorage();
        } catch (e) {
            console.log(e);
        }

    }, []);

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider };