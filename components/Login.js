import { useContext } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { isAuthenticated, user, signIn } = useContext(AuthContext);
  console.log("isauthenticated en login:", isAuthenticated);
  if (isAuthenticated && user) {
    console.log(
      "user dentro de login cuando isAuthenticated y user son true:",
      user
    );
  }

  return (
    <View style={styles.container}>
      {isAuthenticated && user ? null : (
        <Pressable style={styles.button} onPress={() => signIn()}>
          <Text>Inicia sesión</Text>
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
  },
  imageContainer: {
    alignItems: "center", // Centrar la imagen dentro del contenedor
    marginVertical: 10, // Añadir margen vertical para separar la imagen del texto
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
