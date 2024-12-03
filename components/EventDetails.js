import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  FlatList,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { deleteEvent, getEventDetails } from "../services/googleCalendar";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { format } from "date-fns";
const EventDetails = ({ id }) => {
  // const route = useRoute();
  // const { id } = route.params;
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
    return <ActivityIndicator size="large" color="#3498db" />;
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
            <Text style={styles.title}>{event.summary}</Text>
            <Text style={styles.text}>{event.description}</Text>
            <View style={styles.locationContainer}>
              <FontAwesome6 name="location-dot" size={24} color="black" />
              <Text
                style={styles.link}
                onPress={() => Linking.openURL(mapsUrl)}
              >
                {event.location}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Feather name="calendar" size={24} color="black" />
              <View style={styles.dateTextContainer}>
                <Text style={styles.text}>
                  {format(event.start.dateTime, "dd/MM/yyyy HH:mm")}
                </Text>
                <Text style={styles.text}>
                  {format(event.end.dateTime, "dd/MM/yyyy HH:mm")}
                </Text>
              </View>
            </View>
            <View style={styles.participantsContainer}>
              <FontAwesome6 name="users" size={24} color="black" />
              <Text style={styles.participantsText}>Participantes:</Text>
            </View>
          </>
        }
        data={event.attendees}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.participantContainer}>
            {item.responseStatus === "accepted" ? (
              <MaterialIcons name="check" size={24} color="green" />
            ) : item.responseStatus === "declined" ? (
              <MaterialIcons name="cancel" size={24} color="red" />
            ) : (
              <MaterialIcons name="pending-actions" size={24} color="grey" />
            )}
            <Text style={styles.text}>{item.email}</Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {hasExpense && (
              <>
                <View style={styles.gastoContainer}>
                  <FontAwesome6
                    name="money-check-dollar"
                    size={24}
                    color="black"
                  />
                  <View style={styles.gastoTextContainer}>
                    <Text style={styles.text}>
                      Gasto: {event.extendedProperties?.shared?.numericValue}$
                    </Text>
                    <Text style={styles.text}>
                      Gasto por persona:
                      {event.extendedProperties?.shared?.numericValue /
                        (event.attendees?.length + 1)}
                      $
                    </Text>
                    <Text style={styles.text}>
                      Creado por: {event.creator.email}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {isCreator && (
              <>
                <View style={styles.buttonContainer}>
                  <Pressable style={styles.button} onPress={handleEditClick}>
                    <Feather name="edit-3" size={24} color="black" />
                  </Pressable>
                  <Pressable style={styles.button} onPress={handleDelete}>
                    <FontAwesome6 name="trash-can" size={24} color="black" />
                  </Pressable>
                </View>
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
    justifyContent: "center",
    // alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row", // Coloca los botones uno al lado del otro
    justifyContent: "space-between", // Espacio entre los botones
    alignItems: "center", // Alinea los botones verticalmente en el centro
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
    // textAlign: "center",
  },
  link: {
    color: "lightgray",
    textDecorationLine: "none",
    fontSize: 20,
    marginRight: 8,
    marginBottom: 8,
    marginLeft: 20,
  },
  text: {
    color: "white",
    // textAlign: "center",
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 20,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 8,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 140, // Ajusta la anchura del botón
    height: 40,
  },
  flatListContent: {
    padding: 5,
    backgroundColor: "#1b1b1b",
    borderWidth: 5, // Ancho del borde
    borderColor: "#000", // Color del borde
    borderRadius: 10,
  },
  participantContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2c3e50",
    borderRadius: 8,
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Asegura que los elementos estén distribuidos uniformemente
    width: "100%", // Asegura que el contenedor ocupe todo el ancho disponible
  },
  dateTextContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: -5,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  participantsText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10, // Añade un margen izquierdo para separar el texto del icono
  },
  gastoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  gastoTextContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: -5,
  },
});

export default EventDetails;
