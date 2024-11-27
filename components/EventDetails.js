import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import {
  useRoute,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { deleteEvent, getEventDetails } from "../services/googleCalendar";

const EventDetails = () => {
  const route = useRoute();
  const { id } = route.params;
  const [event, setEvent] = useState(null);
  const navigation = useNavigation();
  const { isAuthenticated, user, getAccessToken } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchEventDetails = async () => {
        try {
          const accessToken = await getAccessToken();
          const eventData = await getEventDetails(id, accessToken);
          setEvent(eventData);
        } catch (error) {
          console.error("Error al obtener los detalles del evento:", error);
        }
      };
      fetchEventDetails();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    let isRedirecting = false; // Evita múltiples redirecciones.

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isRedirecting) {
        return; // No hace nada si ya se está redirigiendo.
      }

      e.preventDefault(); // Evita la navegación por defecto.

      isRedirecting = true; // Marca que estás redirigiendo.
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainScreen" }],
        })
      );
    });

    return unsubscribe; // Limpia el listener al desmontar el componente.
  }, [navigation]);

  if (!isAuthenticated) {
    return <Text>Por favor, inicia sesión para ver tus eventos.</Text>;
  }

  const handleEditClick = () => {
    navigation.navigate("EditEvent", { event });
  };

  const handleDelete = async () => {
    if (isAuthenticated) {
      Alert.alert(
        "Eliminar Evento",
        "¿Estás seguro de que quieres eliminar este evento?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              try {
                const accessToken = await getAccessToken();
                await deleteEvent(id, accessToken);
                navigation.navigate("MainScreen");
              } catch (error) {
                console.error("Error al eliminar el evento:", error);
              }
            },
            style: "destructive",
          },
        ]
      );
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
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Titulo: {event.summary}</Text>
            <Text style={styles.text}>Descripción: {event.description}</Text>
            <Text style={styles.link} onPress={() => Linking.openURL(mapsUrl)}>
              {event.location}
            </Text>
            <Text style={styles.text}>Inicio: {event.start.dateTime}</Text>
            <Text style={styles.text}>Fin: {event.end.dateTime}</Text>
            <Text style={styles.text}>Participantes:</Text>
          </>
        }
        data={event.attendees}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => <Text style={styles.text}>{item.email}</Text>}
        ListFooterComponent={
          <>
            {hasExpense && (
              <>
                <Text style={styles.text}>
                  Gasto: {event.extendedProperties?.shared?.numericValue}$
                </Text>
                <Text style={styles.text}>
                  Gasto por persona:{" "}
                  {event.extendedProperties?.shared?.numericValue /
                    (event.attendees?.length + 1)}
                  $
                </Text>
                <Text style={styles.text}>
                  Creado por: {event.creator.email}
                </Text>
              </>
            )}
            {isCreator && (
              <>
                <Pressable style={styles.button} onPress={handleEditClick}>
                  <Text style={styles.buttonText}>Editar Evento</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={handleDelete}>
                  <Text style={styles.buttonText}>Eliminar Evento</Text>
                </Pressable>
              </>
            )}
          </>
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1b1b1b",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  text: {
    color: "white",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 8,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 16,
  },
});

export default EventDetails;
