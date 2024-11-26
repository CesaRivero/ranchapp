import { useContext } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
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
          <Button title="Cerrar Sesión" onPress={signOut} />
        </View>
      ) : (
        <Button title="Iniciar Sesión con Google" onPress={signIn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8", //cambiar color al necesario luego
  },
  userInfo: {
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0000FF",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 8,
    resizeMode: "contain",
  },
});

export default Login;
