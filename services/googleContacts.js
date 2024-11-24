import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState(null);
  const { getAccessToken } = useContext(AuthContext);
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    fetchAccessToken();
  }, [getAccessToken]);

  return accessToken;
};

// Listar contactos
export async function listContacts() {
  const accessToken = useAccessToken();

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
    console.error("Error al listar contactos:", error);
    return [];
  }
}

// Obtener detalles de un contacto por su ID
export async function getContactDetails(contactId) {
  const accessToken = useAccessToken();

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
    console.error("Error al obtener detalles del contacto:", error);
    throw error;
  }
}
