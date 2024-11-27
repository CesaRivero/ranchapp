import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { listContacts } from "../services/googleContacts";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getEventDetails } from "../services/googleCalendar";

const EventForm = ({ onSubmit }) => {
  const { isAuthenticated, getAccessToken } = useContext(AuthContext);
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

  const formatDateTimeLocal = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAccessToken = async () => {
      try {
        const accessToken = await getAccessToken();
        if (isMounted) {
          return accessToken;
        }
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    const fetchContacts = async (accessToken) => {
      try {
        const contacts = await listContacts(accessToken);
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
      fetchAccessToken().then((accessToken) => {
        if (accessToken) {
          fetchContacts(accessToken);
          if (id) {
            fetchEvent(accessToken);
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
          numericValue: amount,
        },
      },
    };
    console.log("handleSubmit called with event dentro de eventform:", event); // Agregar log para depuración

    try {
      await onSubmit(event);
    } catch (error) {
      console.error(
        "Error al crear el evento: dentro de try de onsumit en eventform",
        error
      );
    }
  };

  const handleAddParticipant = () => {
    if (value && !participants.includes(value)) {
      setParticipants([...participants, value]);
      setValue("");
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
            />
            <Text style={{ color: "white" }}>Ubicación:</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />
            <Text style={{ color: "white" }}>Fecha y hora de inicio:</Text>
            <View style={styles.dateTimePicker}>
              <Button
                title="Seleccionar fecha y hora"
                onPress={showStartDatePicker}
              />
              <TextInput
                style={styles.input}
                value={formatDateTimeLocal(startDate)}
                editable={false}
              />
              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="datetime"
                onConfirm={handleStartDateConfirm}
                onCancel={hideStartDatePicker}
              />
            </View>
            <Text style={{ color: "white" }}>Fecha y hora de fin:</Text>
            <View style={styles.dateTimePicker}>
              <Button
                title="Seleccionar fecha y hora"
                onPress={showEndDatePicker}
              />
              <TextInput
                style={styles.input}
                value={formatDateTimeLocal(endDate)}
                editable={false}
              />
              <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="datetime"
                onConfirm={handleEndDateConfirm}
                onCancel={hideEndDatePicker}
              />
            </View>
            <Text style={{ color: "white" }}>Gasto:</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={{ color: "white" }}>Participantes:</Text>
            <TextInput
              style={styles.input}
              placeholder="Añadir participante"
              value={value}
              onChangeText={onChange}
              onBlur={handleAddParticipant}
            />
          </>
        }
        data={suggestions}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSuggestionSelected(item)}>
            <Text>
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
                  <Button
                    title="Eliminar"
                    onPress={() => handleRemoveParticipant(item)}
                  />
                </View>
              )}
            />
            <Button title="Guardar" onPress={handleSubmit} />
          </>
        }
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
    borderRadius: 4,
  },
});

export default EventForm;
