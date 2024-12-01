import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const UserInfo = () => {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      {isAuthenticated && user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Bienvenido, {user.givenName}</Text>
          <Text style={styles.userInfoText}>Email: {user.email}</Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
          </View>
          <Pressable style={styles.button} onPress={signOut}>
            <Text>Cerrar Sesión</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1b1b1b",
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
export default UserInfo;
