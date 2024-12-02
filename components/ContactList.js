import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Pressable,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import {
  listContacts,
  addContact,
  updateContact,
} from "../services/googleContacts";
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modal";

const ContactList = () => {
  const { isAuthenticated, getAccessToken } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const accessToken = await getAccessToken();
        const contacts = await listContacts(accessToken);
        setContacts(contacts);
      } catch (error) {
        console.error("Error al obtener los contactos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);
  const handleAddContact = async () => {
    console.log("handleAddContact called with newContact:", newContact);
    try {
      const accessToken = await getAccessToken();
      const contact = {
        names: [{ displayName: newContact.name }],
        emailAddresses: [{ value: newContact.email }],
        phoneNumbers: newContact.phone ? [{ value: newContact.phone }] : [], // Maneja la ausencia de teléfono
        photos: newContact.photo ? [{ url: newContact.photo }] : [], // Maneja la ausencia de foto
      };
      console.log("Contact data being sent:", contact);
      const addedContact = await addContact(contact, accessToken);
      console.log("addedContact:", contact);
      setContacts([
        ...contacts,
        {
          resourceName: addedContact.resourceName,
          name: addedContact.names
            ? addedContact.names[0].displayName
            : "Sin nombre",
          email: addedContact.emailAddresses
            ? addedContact.emailAddresses[0].value
            : "Sin email",
          phone:
            addedContact.phoneNumbers && addedContact.phoneNumbers.length > 0
              ? addedContact.phoneNumbers[0].value
              : "Sin teléfono",
          photo:
            addedContact.photos && addedContact.photos.length > 0
              ? addedContact.photos[0].url
              : null,
        },
      ]);
      setModalVisible(false);
      setNewContact({ name: "", email: "", phone: "", photo: "" });
    } catch (error) {
      console.error(
        "Error al agregar contacto dentro de handleaddcontac:",
        error
      );
    }
  };

  const handleEditContact = async () => {
    try {
      const accessToken = await getAccessToken();
      const contact = {
        names: [{ displayName: currentContact.name }],
        emailAddresses: [{ value: currentContact.email }],
        phoneNumbers: [{ value: currentContact.phone }],
        photos: [{ url: currentContact.photo }],
      };
      const updatedContact = await updateContact(
        currentContact.resourceName,
        contact,
        accessToken
      );
      setContacts(
        contacts.map((c) =>
          c.resourceName === currentContact.resourceName ? updatedContact : c
        )
      );
      setEditModalVisible(false);
      setCurrentContact(null);
    } catch (error) {
      console.error("Error al editar contacto:", error);
    }
  };
  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contactos</Text>
      <FlatList
        data={contacts}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.resourceName}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            {item.photo && (
              <Image source={{ uri: item.photo }} style={styles.contactPhoto} />
            )}
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactEmail}>{item.email}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
            {/* <Pressable
              style={styles.editButton}
              onPress={() => {
                setCurrentContact(item);
                setEditModalVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </Pressable> */}
          </View>
        )}
        // ListFooterComponent={
        // //   <Pressable
        // //     style={styles.addButton}
        // //     onPress={() => setModalVisible(true)}
        // //   >
        // //     <Text style={styles.buttonText}>Agregar Contacto</Text>
        // //   </Pressable>
        // }
      />
      {/* <Modal
        isVisible={modalVisible}
        onBackdropPress={null} // Deshabilitar el cierre al tocar fuera
        avoidKeyboard={true} // Evita que el teclado cierre el modal
        propagateSwipe={true} // Propaga el gesto de deslizar
        keyboardShouldPersistTaps="always"
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newContact.name}
              onChangeText={(text) =>
                setNewContact({ ...newContact, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newContact.email}
              onChangeText={(text) =>
                setNewContact({ ...newContact, email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={newContact.phone}
              onChangeText={(text) =>
                setNewContact({ ...newContact, phone: text })
              }
            />
            <Button title="Agregar" onPress={handleAddContact} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </ScrollView>
      </Modal>

      <Modal
        isVisible={editModalVisible}
        onBackdropPress={null} // Deshabilitar el cierre al tocar fuera
        avoidKeyboard={true} // Evita que el teclado cierre el modal
        propagateSwipe={true}
        keyboardShouldPersistTaps="always" // Agregado
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={currentContact?.name}
              onChangeText={(text) =>
                setCurrentContact({ ...currentContact, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={currentContact?.email}
              onChangeText={(text) =>
                setCurrentContact({ ...currentContact, email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={currentContact?.phone}
              onChangeText={(text) =>
                setCurrentContact({ ...currentContact, phone: text })
              }
            />

            <Button title="Guardar" onPress={handleEditContact} />
            <Button
              title="Cancelar"
              onPress={() => setEditModalVisible(false)}
            />
          </View>
        </ScrollView>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1b1b1b",
  },
  title: {
    fontSize: 24,
    // fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  contactItem: {
    padding: 16,
    backgroundColor: "#2c3e50",
    borderRadius: 8,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 18,
    color: "white",
  },
  contactEmail: {
    fontSize: 16,
    color: "lightgray",
  },
  contactPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  contactPhone: {
    fontSize: 16,
    color: "lightgray",
  },
  editButton: {
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#1b1b1b",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: Platform.OS === "ios" ? 20 : 0,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});

export default ContactList;
