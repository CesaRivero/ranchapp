import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Linking,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { deleteEvent, getEventDetails } from "../services/googleCalendar";

const EventDetails = () => {
  const route = useRoute();
  const { id } = route.params;
  const [event, setEvent] = useState(null);
  const navigation = useNavigation();
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchEventDetails = async () => {
        try {
          const eventData = await getEventDetails(id);
          setEvent(eventData);
        } catch (error) {
          console.error("Error al obtener los detalles del evento:", error);
        }
      };
      fetchEventDetails();
    }
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return <Text>Por favor, inicia sesión para ver tus eventos.</Text>;
  }

  const handleEditClick = () => {
    navigation.navigate("EditEvent", { id: event.id });
  };

  const handleDelete = async () => {
    if (
      isAuthenticated &&
      confirm("¿Estás seguro de que quieres eliminar este evento?")
    ) {
      try {
        await deleteEvent(id);
        navigation.navigate("EventList");
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    }
  };

  if (!event) {
    return <Text>Cargando...</Text>;
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.location || ""
  )}`;
  const isCreator = event.creator.email === user.email;
  const hasExpense =
    event.extendedProperties?.shared?.numericValue != null &&
    event.extendedProperties.shared.numericValue !== "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.summary}</Text>
      <Text>{event.description}</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(mapsUrl)}>
        {event.location}
      </Text>
      <Text>Inicio: {event.start.dateTime}</Text>
      <Text>Fin: {event.end.dateTime}</Text>
      <Text>Participantes:</Text>
      <FlatList
        data={event.attendees}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => <Text>{item.email}</Text>}
      />
      {hasExpense && (
        <>
          <Text>Gasto: {event.extendedProperties?.shared?.numericValue}$</Text>
          <Text>
            Gasto por persona:{" "}
            {event.extendedProperties?.shared?.numericValue /
              (event.attendees?.length + 1)}
            $
          </Text>
          <Text>Creado por: {event.creator.email}</Text>
        </>
      )}
      {isCreator && (
        <>
          <Button title="Editar Evento" onPress={handleEditClick} />
          <Button title="Eliminar Evento" onPress={handleDelete} />
        </>
      )}
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default EventDetails;
