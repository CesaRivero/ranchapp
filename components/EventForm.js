import React, { useContext, useEffect, useRef, useState } from "react";
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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
const EventForm = ({ onSubmit }) => {
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const route = useRoute();
  const { event } = route.params || {};
  const id = event?.id;
  const isEdit = !!id; // Determina si estamos en modo de edición

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [participants, setParticipants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState({
    address: "",
    lat: null,
    lng: null,
    placeId: "",
  });
  const [amount, setAmount] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const { colors, fonts } = useTheme();
  const googlePlacesRef = useRef();
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
          if (isEdit) {
            fetchEvent(token);
          } else {
            // Limpiar los campos del formulario si no estamos en modo de edición
            setTitle("");
            setDescription("");
            setStartDate(new Date());
            setEndDate(new Date());
            setParticipants([]);
            setLocation({
              address: "",
              lat: null,
              lng: null,
              placeId: "",
            });
            setAmount("");
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
    console.log("dentro de submit en eventform");
    if (!title.trim()) {
      alert("Por favor, añade un título.");
      return;
    }

    if (!description.trim()) {
      alert("Por favor, añade una descripción.");
      return;
    }

    // if (!location.trim()) {
    //   alert("Por favor, añade una ubicación.");
    //   return;
    // }
    if (participants.length === 0) {
      alert("Por favor, añade al menos un participante.");
      return;
    }

    const event = {
      id,
      summary: title,
      description,
      location: location.address,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
      attendees: [
        ...participants.map((email) => ({ email })),
        { email: user.email, responseStatus: "accepted" }, // Agrega el correo electrónico del usuario actual
      ],
      extendedProperties: {
        shared: {
          numericValue: amount || "",
          lat: location.lat, // Latitud
          lng: location.lng, // Longitud
          placeId: location.placeId, // ID del lugar
        },
      },
    };
    console.log("handleSubmit called with event dentro de eventform:", event); // Agregar log para depuración
    setLoading(true);
    try {
      await onSubmit(event);
      // Limpiar los campos del formulario después de enviar el evento
      setTitle("");
      setDescription("");
      setStartDate(new Date());
      setEndDate(new Date());
      setParticipants([]);
      setLocation({
        address: "",
        lat: null,
        lng: null,
        placeId: "",
      });
      setAmount("");
      googlePlacesRef.current?.clear(); // Restablecer el estado del componente GooglePlacesAutocomplete
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
        keyboardShouldPersistTaps="handled"
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
              multiline={true}
              numberOfLines={4}
              maxLength={250}
            />
            <Text style={{ color: "white" }}>Ubicación:</Text>

            <GooglePlacesAutocomplete
              ref={googlePlacesRef} // Agregar la referencia aquí
              // placeholder="Search"
              onPress={(data, details = null) => {
                setLocation({
                  address: data.description,
                  lat: details.geometry.location.lat,
                  lng: details.geometry.location.lng,
                  placeId: data.place_id,
                });
                console.log("Ubicación seleccionada:", {
                  address: data.description,
                  lat: details.geometry.location.lat,
                  lng: details.geometry.location.lng,
                  placeId: data.place_id,
                });
              }}
              query={{
                key: "AIzaSyCK31OHUTBqJQOOrwfZABdB5EtUcTUDLII",
                language: "es",
              }}
              fetchDetails={true}
              styles={{
                textInputContainer: {
                  width: "100%",
                  padding: 8,
                  marginVertical: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 4,
                  backgroundColor: colors.background,
                },
                textInput: {
                  color: "white",
                  backgroundColor: colors.background,
                  height: 30,
                  borderRadius: 4,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: "#1faadb",
                },
              }}
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
              keyboardType="numeric"
              maxLength={10}
            />
            <Text style={{ color: "white" }}>Participantes:</Text>
            <View style={styles.participantInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Añadir participante"
                placeholderTextColor="#ccc"
                value={value}
                onChangeText={onChange}
              />

              {suggestions.length === 0 && value.trim() !== "" && (
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    { transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }] },
                  ]}
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
                style={({ pressed }) => [
                  styles.button,
                  { transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }] },
                ]}
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
