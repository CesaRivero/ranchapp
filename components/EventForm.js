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
import { listContacts } from "../services/googleContacts";
import { AuthContext } from "../context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getEventDetails } from "../services/googleCalendar";

const EventForm = ({ onSubmit }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participants, setParticipants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");

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
    if (isAuthenticated) {
      async function fetchContacts() {
        try {
          const contacts = await listContacts(accessToken);
          setContacts(contacts);
        } catch (error) {
          console.error(
            "Error al obtener los contactos: dentro de useefect de eventform",
            error
          );
        }
      }
      fetchContacts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (id) {
      async function fetchEvent() {
        try {
          const accessToken = await getAccessToken();
          const event = await getEventDetails(id, accessToken);
          setTitle(event.summary);
          setDescription(event.description);
          setStartDate(formatDateTimeLocal(event.start.dateTime));
          setEndDate(formatDateTimeLocal(event.end.dateTime));
          setParticipants(event.attendees.map((att) => att.email));
          setLocation(event.location);
          setAmount(event.extendedProperties.shared.numericValue);
        } catch (error) {
          console.error("Error al obtener los detalles del evento:", error);
        }
      }
      fetchEvent();
    }
  }, [id]);

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
        dateTime: new Date(startDate).toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
      end: {
        dateTime: new Date(endDate).toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
      attendees: participants.map((email) => ({ email })),
      extendedProperties: {
        shared: {
          numericValue: amount,
        },
      },
    };

    await onSubmit(event);
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

  return (
    <View style={styles.container}>
      <Text>Título:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        required
      />
      <Text>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Text>Ubicación:</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />
      <Text>Fecha y hora de inicio:</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        required
      />
      <Text>Fecha y hora de fin:</Text>
      <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
        required
      />
      <Text>Gasto:</Text>
      <TextInput style={styles.input} value={amount} onChangeText={setAmount} />
      <Text>Participantes:</Text>
      <TextInput
        style={styles.input}
        placeholder="Añadir participante"
        value={value}
        onChangeText={onChange}
        onBlur={handleAddParticipant}
      />
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSuggestionSelected(item)}>
            <Text>
              {item.name} ({item.email})
            </Text>
          </TouchableOpacity>
        )}
      />
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
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    width: "100%",
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
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
