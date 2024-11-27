import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { listUpcomingEvents } from "../services/googleCalendar";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

function EventList() {
  const { isAuthenticated, getAccessToken } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchEvents() {
        try {
          const accessToken = await getAccessToken();
          const result = await listUpcomingEvents(accessToken);
          setEvents(result);
          console.log("Eventos:", result);
        } catch (error) {
          console.error("Error al listar eventos:", error);
        }
      }
      fetchEvents();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Text>Por favor, inicia sesión para ver tus eventos.</Text>;
  }

  return (
    <View style={styles.container}>
      {events.length === 0 ? (
        <Text style={styles.errorText}>No hay eventos disponibles.</Text>
      ) : (
        events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() =>
              navigation.navigate("EventDetails", { id: event.id })
            }
          >
            <Text style={styles.eventTitle}>{event.summary}</Text>
            <Text>{event.start.dateTime}</Text>
            <Text>{event.location}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 30,
    color: "red",
  },
});

export default EventList;
