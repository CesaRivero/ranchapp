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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns"; // Importa la función de formato de date-fns

function EventList() {
  const { isAuthenticated, getAccessToken } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

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
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() =>
              navigation.navigate("EventDetailsScreen", { id: event.id })
            }
          >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26, //vatia el tamaño de las card ver luego
    backgroundColor: "#1b1b1b",
  },
  eventCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#3498db",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Centra el texto horizontalmente
  },
  eventTextLocation: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
  eventTextContainer: {
    textAlign: "center", // Centra el contenido horizontalmente
  },
  errorText: {
    fontSize: 30,
    color: "#3498db",
  },
});

export default EventList;
