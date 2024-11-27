import { useContext } from "react";
import { View, Text, Image, Button, StyleSheet, Pressable } from "react-native";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { isAuthenticated, user, signIn, signOut } = useContext(AuthContext);

  if (isAuthenticated && user) {
    console.log(
      "user dentro de login cuando isAuthenticated y user son true:",
      user
    );
  }

  return (
    <View style={styles.container}>
      {isAuthenticated && user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Bienvenido, {user.givenName}</Text>
          <Text style={styles.userInfoText}>Email: {user.email}</Text>
          <Image source={{ uri: user.photo }} style={styles.profileImage} />
          <Pressable style={styles.button} onPress={signOut}>
            <Text>Cerrar Sesión</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.button} onPress={() => signIn()}>
          <Text>Inicia sesión para continuar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1b1b1b",
  },
  userInfo: {
    // alignItems: "center",
  },
  userInfoText: {
    fontSize: 16,
    color: "white",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "contain",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 8,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
});

export default Login;
