import React from "react";
import { useNavigation } from "@react-navigation/native";
import EventForm from "./EventForm";
import { createEvent, updateEvent } from "../services/googleCalendar";

const EventFormWrapper = ({ isEdit }) => {
  const navigation = useNavigation();

  const handleCreateEvent = async (event) => {
    try {
      const createdEvent = await createEvent(event);
      console.log("Evento creado:", createdEvent);
      navigation.navigate("EventDetails", { id: createdEvent.id });
    } catch (error) {
      console.error("Error al crear el evento:", error);
    }
  };

  const handleUpdateEvent = async (event) => {
    try {
      await updateEvent(event.id, event);
      console.log("Evento actualizado:", event);
      navigation.navigate("EventDetails", { id: event.id });
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  return (
    <EventForm onSubmit={isEdit ? handleUpdateEvent : handleCreateEvent} />
  );
};

export default EventFormWrapper;
