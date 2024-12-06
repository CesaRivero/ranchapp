import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { listContacts } from "../services/googleContacts";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useTheme } from "@react-navigation/native";
import { getEventDetails } from "../services/googleCalendar";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { format } from "date-fns";
const EventForm = ({ onSubmit }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const route = useRoute();
  const { event } = route.params || {};
  const id = event?.id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [participants, setParticipants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const { colors, fonts } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    input: {
      width: "100%",
      padding: 8,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 4,
      color: "white",
    },
    dateTimePicker: {
      marginVertical: 8,
    },
    participant: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      marginVertical: 4,
      backgroundColor: "#f8f8f8",
      borderRadius: 10,
      marginBottom: 10,
    },
    suggestionItem: {
      padding: 15,
      backgroundColor: "#2c3e50",
      borderBottomWidth: 0,
      borderBottomColor: "#ccc",
      marginBottom: 8,
      marginTop: 8,
    },
    suggestionText: {
      color: "white",
    },
    button: {
      backgroundColor: colors.button,
      padding: 8,
      margin: 16,
      borderRadius: 4,
      alignItems: "center",
      transform: isButtonPressed ? "scale(0.95)" : "scale(1)",
    },
    addButton: {
      backgroundColor: colors.button,
      padding: 8,
      marginLeft: 8,
      borderRadius: 4,
      width: 60,
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchAccessToken = async () => {
      try {
        if (!token) return;
        if (isMounted) {
          return token;
        }
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    const fetchContacts = async (token) => {
      try {
        const contacts = await listContacts(token);
        setContacts(contacts);
      } catch (error) {
        console.error(
          "Error al obtener los contactos: dentro de useefect de eventform",
          error
        );
      }
    };

    const fetchEvent = async (accessToken) => {
      console.log("id dentro de fetchEvent en eventform:", id);
      try {
        const event = await getEventDetails(id, accessToken);
        setTitle(event.summary);
        setDescription(event.description);
        setStartDate(new Date(event.start.dateTime));
        setEndDate(new Date(event.end.dateTime));
        setParticipants(event.attendees.map((att) => att.email));
        setLocation(event.location);
        setAmount(event.extendedProperties.shared.numericValue);
      } catch (error) {
        console.error("Error al obtener los detalles del evento:", error);
      }
    };

    if (isAuthenticated) {
      fetchAccessToken().then((token) => {
        if (token) {
          fetchContacts(token);
          if (id) {
            fetchEvent(token);
          }
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones
    if (!title.trim()) {
      alert("Por favor, añade un título.");
      return;
    }

    if (!description.trim()) {
      alert("Por favor, añade una descripción.");
      return;
    }

    if (!location.trim()) {
      alert("Por favor, añade una ubicación.");
      return;
    }
    if (participants.length === 0) {
      alert("Por favor, añade al menos un participante.");
      return;
    }
    const event = {
      id,
      summary: title,
      description,
      location: location,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
      attendees: participants.map((email) => ({ email })),
      extendedProperties: {
        shared: {
          numericValue: amount || "",
        },
      },
    };
    console.log("handleSubmit called with event dentro de eventform:", event); // Agregar log para depuración
    setLoading(true);
    try {
      await onSubmit(event);
    } catch (error) {
      console.error(
        "Error al crear el evento: dentro de try de onsumit en eventform",
        error
      );
      alert("Error al crear el evento, intente de nuevo mas tarde.");
    } finally {
      setLoading(false); // Termina la carga
    }
  };

  const handleAddParticipant = () => {
    if (value && !participants.includes(value)) {
      if (value.includes("@")) {
        setParticipants([...participants, value]);
        setValue("");
      } else {
        alert("Ingrese un mail valido");
      }
    }
  };

  const handleRemoveParticipant = (email) => {
    setParticipants(
      participants.filter((participant) => participant !== email)
    );
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : contacts.filter((contact) =>
          contact.email.toLowerCase().includes(inputValue)
        );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (text) => {
    setValue(text);
    onSuggestionsFetchRequested({ value: text });
  };

  const onSuggestionSelected = (suggestion) => {
    if (!participants.includes(suggestion.email)) {
      setParticipants([...participants, suggestion.email]);
    }
    setValue("");
    onSuggestionsClearRequested();
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={{ color: "white" }}>Título:</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              required
            />
            <Text style={{ color: "white" }}>Descripción:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              required
            />
            <Text style={{ color: "white" }}>Ubicación:</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              required
            />
            <Text style={{ color: "white" }}>Fecha y hora de inicio:</Text>
            <View style={styles.dateTimePicker}>
              <TouchableOpacity onPress={showStartDatePicker}>
                <View pointerEvents="none">
                  <TextInput
                    style={styles.input}
                    value={format(startDate, "dd/MM/yyyy HH:mm")}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="datetime"
                onConfirm={handleStartDateConfirm}
                onCancel={hideStartDatePicker}
              />
            </View>
            <Text style={{ color: "white" }}>Fecha y hora de fin:</Text>
            <View style={styles.dateTimePicker}>
              <TouchableOpacity onPress={showEndDatePicker}>
                <View pointerEvents="none">
                  <TextInput
                    style={styles.input}
                    value={format(endDate, "dd/MM/yyyy HH:mm")}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="datetime"
                onConfirm={handleEndDateConfirm}
                onCancel={hideEndDatePicker}
                minimumDate={startDate}
              />
            </View>
            <Text style={{ color: "white" }}>Gasto:</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={{ color: "white" }}>Participantes:</Text>
            <View style={styles.participantInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Añadir participante"
                placeholderTextColor="#ccc" // Cambia el color del placeholder
                value={value}
                onChangeText={onChange}
              />

              {suggestions.length === 0 && value.trim() !== "" && (
                <Pressable
                  style={styles.addButton}
                  onPress={handleAddParticipant}
                >
                  <Text>Añadir</Text>
                </Pressable>
              )}
            </View>
          </>
        }
        data={suggestions}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => onSuggestionSelected(item)}
          >
            <Text style={styles.suggestionText}>
              {item.name} ({item.email})
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            <FlatList
              data={participants}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.participant}>
                  <Text>{item}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveParticipant(item)}
                  >
                    <FontAwesome6 name="trash-can" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {loading ? (
              <ActivityIndicator size="large" color={colors.button} />
            ) : (
              <Pressable
                style={styles.button}
                onPressIn={() => setIsButtonPressed(true)}
                onPressOut={() => setIsButtonPressed(false)}
                onPress={handleSubmit}
              >
                <Text>Guardar</Text>
              </Pressable>
            )}
          </>
        }
      />
    </View>
  );
};

export default EventForm;
