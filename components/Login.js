import { useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "@react-navigation/native";

function Login() {
  const { isAuthenticated, user, signIn } = useContext(AuthContext);
  console.log("isauthenticated en login:", isAuthenticated);
  if (isAuthenticated && user) {
    console.log(
      "user dentro de login cuando isAuthenticated y user son true:",
      user
    );
  }
  const { colors, fonts } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: colors.background,
    },
    button: {
      backgroundColor: colors.button,
      padding: 8,
      margin: 16,
      borderRadius: 4,
      alignItems: "center",
      marginTop: 150,
      transition: "transform 0.1s",
    },
  });

  return (
    <View style={styles.container}>
      {isAuthenticated && user ? null : (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
            },
          ]}
          onPress={() => signIn()}
        >
          <Text>Inicia sesión</Text>
        </Pressable>
      )}
    </View>
  );
}

export default Login;
