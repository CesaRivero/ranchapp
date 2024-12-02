import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import EventForm from "./EventForm";
import { createEvent, updateEvent } from "../services/googleCalendar";
import { AuthContext } from "../context/AuthContext";

const EventFormWrapper = ({ isEdit }) => {
  const navigation = useNavigation();
  const { getAccessToken } = useContext(AuthContext);

  const handleCreateEvent = async (event) => {
    console.log(
      "handleCreateEvent called with event dentro de eventformwrapper: ",
      event
    );
    console.log(
      "isEdit dentro de eventformwrapper y dentro de hadlecreatevenet: ",
      isEdit
    );

    try {
      const accessToken = await getAccessToken();
      const createdEvent = await createEvent(event, accessToken);
      console.log("Evento creado:", createdEvent);
      navigation.navigate("MainStack", {
        screen: "EventDetailsScreen",
        params: { id: createdEvent.id },
      });
    } catch (error) {
      console.error(
        "Error al crear el evento dentro de eventfornwrapper:",
        error
      );
    }
  };

  const handleUpdateEvent = async (event) => {
    console.log("handleUpdateEvent called with event:", event);

    try {
      const accessToken = await getAccessToken();
      await updateEvent(event.id, event, accessToken);
      console.log("Evento actualizado:", event);
      navigation.navigate("MainStack", {
        screen: "EventDetailsScreen",
        params: { id: event.id },
      });
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  return (
    <EventForm onSubmit={isEdit ? handleUpdateEvent : handleCreateEvent} />
  );
};

export default EventFormWrapper;
