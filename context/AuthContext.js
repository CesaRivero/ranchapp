import React, { createContext, useState, useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "36174827018-1iaoio2slt1m67rfdvvlbeaustv58anh.apps.googleusercontent.com",
  iosClientId:
    "36174827018-mksd8fdssqv7u66k5tunsugies15sol2.apps.googleusercontent.com",
  offlineAccess: true,
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/contacts",
  ],
});

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkIfSignedIn = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        if (userInfo && userInfo.user) {
          setUser(userInfo.user);
          setIsAuthenticated(true);
          console.log(
            "isAuthenticated en funcion checkIFsingin: dentro del try y dentro del if",
            isAuthenticated
          );
          console.log(
            "userinfo: en funcion checkIFsingin dentro del if ",
            userInfo.user
          );
        } else {
          setIsAuthenticated(false);
          console.log(
            "isAuthenticated en else del userinfo: ",
            isAuthenticated
          );
        }
      } catch (error) {
        if (error.code !== statusCodes.SIGN_IN_REQUIRED) {
          console.error("Error checking sign-in status:", error);
        }
      }
    };

    checkIfSignedIn();
  }, []);

  // Función para iniciar sesión con Google
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo.data.user);
      console.log("userinfo: en funcion singin ", userInfo.data.user);
      console.log("isAuthenticated en funcion singin: ", isAuthenticated);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Función para obtener el token de acceso
  const getAccessToken = async () => {
    try {
      const tokens = await GoogleSignin.getTokens();
      return tokens.accessToken;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signOut, getAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
