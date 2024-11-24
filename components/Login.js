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
          <Text>Bienvenido, {user.givenName}</Text>
          <Text>Email: {user.email}</Text>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 8,
  },
});

export default Login;
