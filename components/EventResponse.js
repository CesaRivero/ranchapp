import { useContext, useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { updateResponseStatus } from "../services/googleCalendar";
import { useTheme } from "@react-navigation/native";

const EventResponse = ({ id }) => {
  const { user, token } = useContext(AuthContext);
  const { colors, fonts } = useTheme();
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  //   const isCreator = event.creator.email === user.email;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      //   backgroundColor: colors.button, //puede ser hace una filla
      //   justifyContent: "center",
      borderRadius: 10,
      //   margin: 10,
      // alignItems: "center",
    },
    buttonContainer: {
      //   flex: 1,
      flexDirection: "row", // Coloca los botones uno al lado del otro
      justifyContent: "space-between", // Espacio entre los botones
      alignItems: "center", // Alinea los botones verticalmente en el centro
    },
    button: {
      backgroundColor: colors.text,
      padding: 8,
      //   margin: 16,
      marginLeft: 10,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      //   width: 140, // Ajusta la anchura del botón
      //   height: 40,
      transform: isButtonPressed ? "scale(0.95)" : "scale(1)",
    },
  });
  const hadleResponseStatus = (status) => {
    const userEmail = user.email;
    const accessToken = token;
    try {
      updateResponseStatus(id, status, userEmail, accessToken);
      setResponseStatus(status);
      alert("Evento confirmado");
    } catch (e) {
      console.log(e);
      alert("No se pudo cambiar la respuesta al evento");
    }
  };
  return (
    // {user.self}
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPressIn={() => setIsButtonPressed(true)}
          onPressOut={() => setIsButtonPressed(false)}
          onPress={() => hadleResponseStatus("accepted")}
        >
          <Text>Aceptar</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPressIn={() => setIsButtonPressed(true)}
          onPressOut={() => setIsButtonPressed(false)}
          onPress={() => hadleResponseStatus("needsAction")}
        >
          <Text>Tal vez</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPressIn={() => setIsButtonPressed(true)}
          onPressOut={() => setIsButtonPressed(false)}
          onPress={() => hadleResponseStatus("declined")}
        >
          <Text>Rechazar</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default EventResponse;
