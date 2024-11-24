import { useContext } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { isAuthenticated, user, signIn, signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {isAuthenticated && user ? (
        <View style={styles.userInfo}>
          <Text>Bienvenido, {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
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
