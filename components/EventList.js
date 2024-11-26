import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { listUpcomingEvents } from "../services/googleCalendar";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

function EventList() {
  const { isAuthenticated } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchEvents() {
        const result = await listUpcomingEvents();
        setEvents(result);
        console.log("Eventos:", result);
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
        <Text>No hay eventos disponibles.</Text>
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
  },
  eventCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
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
});

export default EventList;
