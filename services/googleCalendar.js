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
    console.error(
      "Error al listar eventos detro de listevent googlecalendar:",
      error
    );
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
    try {
      await scheduleNotification(event);
      console.log("Evento creado y notificado:", event);
    } catch (notificationError) {
      console.error("Error al programar notificación:", notificationError);
    }
    console.log("titulo del evento creado", event.summary);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("evento que llego al google", event);
      // La solicitud se realizó y el servidor respondió con un código de estado
      // que cae fuera del rango de 2xx
      console.error("Error en la respuesta de la API:", error.response.data);
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error("No se recibió respuesta de la API:", error.request);
    } else {
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error("Error al configurar la solicitud:", error.message);
    }
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
    try {
      await scheduleEditNotification(updatedEvent.summary);
      console.log("titulo del evento a modificar", updatedEvent.summary);
    } catch (notificationError) {
      console.error("Error al programar notificación:", notificationError);
      console.log("titulo del evento a modificar", updatedEvent.summary);
    }
    console.log("titulo del evento modificado", updatedEvent.summary);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el evento:", error);
    throw error;
  }
}

// Eliminar un evento
export async function deleteEvent(eventId, eventTitle, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }
  console.log(
    `Datos que recibe la funcion de eliminar en googlecalendar: ID: ${eventId}, TITULO: ${eventTitle},  TOKEN: ${accessToken}`
  );
  try {
    await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    try {
      await scheduleDeleteNotification(eventTitle);
      console.log(
        "titulo del evento a eliminar luego de ejecutar la notificaicon ",
        eventTitle
      );
    } catch (notificationError) {
      console.error(
        "Error al programar notificación en eliminar dentro de googlecalendar dentro del catch de notificacion:",
        notificationError
      );
    }
    console.log("Evento eliminado: ", eventTitle);
    return true;
  } catch (notificationError) {
    console.error(
      "Error al programar notificación en eliminar deltro del catch orincipal, no ejecuta la peticion pero si elimina:",
      notificationError
    );
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

// Actualizar el estado de respuesta de un participante //falta implmentar
export async function updateResponseStatus(
  eventId,
  responseStatus,
  userEmail,
  accessToken
) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await axios.patch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        attendees: [
          {
            email: userEmail, // Email del usuario autenticado
            responseStatus: responseStatus, // 'accepted', 'declined', 'needsAction'
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(`Estado de respuesta actualizado a: ${responseStatus}`);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado de respuesta:", error);
    throw error;
  }
}
