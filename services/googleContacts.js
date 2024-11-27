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
          personFields: "names,emailAddresses",
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
          personFields: "names,emailAddresses,phoneNumbers",
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
