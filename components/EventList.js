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
import { format } from "date-fns";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
function EventList() {
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const { colors, fonts } = useTheme();
  const [loading, setLoading] = useState(true); // Estado de carga

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
      marginBottom: 5,
      textAlign: "center", // Centra el texto horizontalmente
    },
    eventTextLocation: {
      textAlign: "center",
      fontSize: 15,
      marginBottom: 5,
      fontWeight: "500",
    },
    eventTextContainer: {
      textAlign: "center", // Centra el contenido horizontalmente
      fontSize: 15,
      marginBottom: 2.5,
      color: colors.textMain,
    },
    errorText: {
      fontSize: 25,
      color: colors.text,
      textAlign: "center",
    },
    erroContainer: {
      backgroundColor: colors.button,
      borderRadius: 8,
      width: "80%",
      margin: 20,
      alignItems: "center",
      justifyContent: "center",
      height: 80,
      flexDirection: "row",
      alignSelf: "center", // Centra el contenedor horizontalmente
      paddingHorizontal: 10,
    },
    iconContainer: {
      position: "absolute",
      right: 10,
      top: 10,
    },
  });
  const fetchEvents = async () => {
    try {
      if (!token) return;
      const result = await listUpcomingEvents(token);
      setEvents(result);
      console.log("Eventos:", result);
    } catch (error) {
      console.error("Error al listar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        setLoading(true);
        fetchEvents();
      }
    }, [isAuthenticated])
  );

  if (events.length === 0 && loading === false) {
    return (
      <View style={styles.erroContainer}>
        <Text style={styles.errorText}>
          Parece que no tienes eventos todavia!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
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
            {event.creator.self ? (
              <View style={styles.iconContainer}>
                <Ionicons name="create" size={24} color="black" />
              </View>
            ) : (
              <View style={styles.iconContainer}>
                <FontAwesome name="user" size={24} color="black" />
              </View>
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
