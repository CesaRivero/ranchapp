import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { listUpcomingEvents } from "../services/googleCalendar";
import { AuthContext } from "../context/AuthContext";
import {
  useNavigation,
  useFocusEffect,
  useTheme,
} from "@react-navigation/native";
import { format } from "date-fns"; // Importa la función de formato de date-fns
import FontAwesome from "@expo/vector-icons/FontAwesome";
function EventList() {
  const { isAuthenticated, getAccessToken, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const { colors, fonts } = useTheme(); // Accede a los colores y fuentes del tema

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 25, //vatia el tamaño de las card ver luego
      backgroundColor: colors.background,
      marginTop: -15,
    },
    eventCard: {
      padding: 10, //16
      marginVertical: 8,
      backgroundColor: colors.button,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      width: "100%",
    },
    eventTitle: {
      fontSize: 24,
      fontFamily: fonts.bold,
      color: colors.textMain,

      textAlign: "center", // Centra el texto horizontalmente
    },
    eventTextLocation: {
      textAlign: "center",
      fontSize: 15,
      fontWeight: "500",
    },
    eventTextContainer: {
      textAlign: "center", // Centra el contenido horizontalmente
      fontSize: 15,
      color: colors.textMain,
    },
    errorText: {
      fontSize: 30,
      color: "#3498db",
    },
  });
  const fetchEvents = async () => {
    try {
      const accessToken = await getAccessToken();
      const result = await listUpcomingEvents(accessToken);
      setEvents(result);
      console.log("Eventos:", result);
    } catch (error) {
      console.error("Error al listar eventos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchEvents();
      }
    }, [isAuthenticated])
  );

  if (!isAuthenticated) {
    return <Text>Por favor, inicia sesión para ver tus eventos.</Text>;
  }

  return (
    <View style={styles.container}>
      {events.length === 0 ? (
        <ActivityIndicator size="large" color={colors.button} />
      ) : (
        events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() =>
              navigation.navigate("EventDetailsScreen", { id: event.id })
            }
          >
            {event.creator.self && (
              <FontAwesome name="user" size={24} color="black" />
            )}
            <Text style={styles.eventTitle}>{event.summary}</Text>
            <Text style={styles.eventTextContainer}>
              {format(new Date(event.start.dateTime), "dd/MM/yyyy HH:mm")}
            </Text>
            <Text style={styles.eventTextContainer}>
              {format(new Date(event.end.dateTime), "dd/MM/yyyy HH:mm")}
            </Text>
            <Text style={styles.eventTextLocation}>{event.location}</Text>
            <Text style={styles.eventTextContainer}>
              {event.organizer.email}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

export default EventList;
