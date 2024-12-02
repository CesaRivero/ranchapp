import axios from "axios";
import {
  scheduleDeleteNotification,
  scheduleEditNotification,
  scheduleNotification,
} from "./notificationSetup";
export async function listUpcomingEvents(accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("Error al listar eventos:", error);
    return [];
  }
}

// Crear un nuevo evento
export async function createEvent(event, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }
  console.log("Creating event with access token:", accessToken);

  try {
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      event,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    await scheduleNotification(event);

    return response.data;
  } catch (error) {
    console.error("Error al crear el evento dentro de googlecalendar:", error);
    throw error;
  }
}

// Actualizar un evento existente
export async function updateEvent(eventId, updatedEvent, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await axios.put(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      updatedEvent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    await scheduleEditNotification(updatedEvent);

    return response.data;
  } catch (error) {
    console.error("Error al actualizar el evento:", error);
    throw error;
  }
}

// Eliminar un evento
export async function deleteEvent(eventId, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    await scheduleDeleteNotification({ summary: eventId });

    return true;
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    return false;
  }
}

// Obtener los detalles de un evento
export async function getEventDetails(eventId, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los detalles del evento:", error);
    throw error;
  }
}
