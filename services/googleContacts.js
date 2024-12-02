import axios from "axios";

// Listar contactos
export async function listContacts(accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await axios.get(
      "https://people.googleapis.com/v1/people/me/connections",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          personFields: "names,emailAddresses,phoneNumbers,photos",
          pageSize: 50,
        },
      }
    );

    if (!response.data.connections) {
      return [];
    }

    return response.data.connections.map((contact) => ({
      name: contact.names?.[0]?.displayName || "Sin nombre",
      email: contact.emailAddresses?.[0]?.value || "Sin email",
      phone: contact.phoneNumbers?.[0]?.value || "Sin teléfono",
      photo: contact.photos?.[0]?.url || null,
    }));
  } catch (error) {
    console.error("Error al listar contactos dentro de googlecontacts:", error);
    return [];
  }
}

// Obtener detalles de un contacto por su ID
export async function getContactDetails(contactId, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await axios.get(
      `https://people.googleapis.com/v1/people/${contactId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          personFields: "names,emailAddresses,phoneNumbers,photos",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener detalles del contacto dentro de getcontaat en googlec:",
      error
    );
    throw error;
  }
}
export async function addContact(contact, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    console.log("Sending contact data to Google People API:", contact);

    const response = await axios.post(
      "https://people.googleapis.com/v1/people:createContact",
      {
        names: contact.names,
        emailAddresses: contact.emailAddresses,
        phoneNumbers: contact.phoneNumbers || [], // Maneja la ausencia de teléfono
        photos: contact.photos || [], // Maneja la ausencia de foto
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          // personFields: "names,emailAddresses,phoneNumbers,photos", // Asegúrate de incluir los campos necesarios
        },
      }
    );
    console.log("Contacto agregado: ", response.data);
    if (!response.data.names) {
      console.warn(
        "El campo 'names' no está presente en la respuesta de la API."
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error al agregar contacto dentro de googlecontacts:", error);
    throw error;
  }
} // Editar un contacto
export async function updateContact(contactId, contact, accessToken) {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await axios.patch(
      `https://people.googleapis.com/v1/people/${contactId}:updateContact`,
      {
        names: contact.names,
        emailAddresses: contact.emailAddresses,
        phoneNumbers: contact.phoneNumbers || [], // Maneja la ausencia de teléfono
        photos: contact.photos || [], // Maneja la ausencia de foto
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          updatePersonFields: "names,emailAddresses,phoneNumbers,photos",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al editar contacto dentro de googlecontacts:", error);
    throw error;
  }
}
