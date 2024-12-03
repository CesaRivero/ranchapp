import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import ContactList from "./ContactList";
import { FlatList } from "react-native-gesture-handler";

const UserInfo = () => {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [aboutUsModalVisible, setAboutUsModalVisible] = useState(false);

  const renderHeader = () => (
    <View>
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>Bienvenido, {user.givenName}</Text>
        <Text style={styles.userInfoText}>Email: {user.email}</Text>
        <View style={styles.imageContainer}>
          <Image source={{ uri: user.photo }} style={styles.profileImage} />
        </View>
        <Pressable style={styles.button} onPress={signOut}>
          <Text>Cerrar Sesión</Text>
        </Pressable>
      </View>
    </View>
  );
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Image
        source={require("../assets/logo-mini.png")}
        style={styles.profileImageLogo}
      />
      <Pressable onPress={() => setModalVisible(true)}>
        <Text style={styles.footerText}>Términos y Condiciones</Text>
      </Pressable>
      <Pressable onPress={() => setAboutUsModalVisible(true)}>
        <Text style={styles.footerText}>Sobre Nosotros</Text>
      </Pressable>
    </View>
  );
  return (
    <View style={styles.container}>
      {isAuthenticated && user ? (
        <FlatList
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          data={[]}
          renderItem={null}
          ListEmptyComponent={<ContactList />}
          showsVerticalScrollIndicator={false}
        />
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                Términos y Condiciones de Uso de RanchApp
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalNumber}>1. Introducción</Text>
                {"\n"}Bienvenido a RanchApp, una aplicación desarrollada para
                facilitar la organización de eventos sociales entre amigos y
                familiares. A través de RanchApp, los usuarios pueden gestionar
                eventos, coordinar asistencia, dividir gastos, y ubicar eventos
                mediante geolocalización. Al utilizar RanchApp, aceptas los
                presentes Términos y Condiciones, los cuales constituyen un
                acuerdo legal entre el usuario y RanchApp. Si no estás de
                acuerdo, te solicitamos que no utilices la aplicación.
                {"\n\n"}
                <Text style={styles.modalNumber}>
                  2. Uso de RanchApp y Responsabilidad del Usuario
                </Text>
                {"\n"}RanchApp proporciona diversas funcionalidades para la
                organización de eventos, incluyendo:
                {"\n"}Creación de eventos sociales y su gestión (nombre, fecha,
                ubicación, descripción).
                {"\n"}Confirmación de asistencia por parte de los participantes.
                {"\n"}División de gastos entre los asistentes mediante
                integración con Mercado Pago.
                {"\n"}Visualización de ubicaciones de eventos a través de Google
                Maps API.
                {"\n"}El usuario se compromete a:
                {"\n"}Utilizar la aplicación únicamente para fines personales y
                lícitos.
                {"\n"}Proporcionar información verídica y actualizada.
                {"\n"}Ser responsable de la seguridad de su cuenta, manteniendo
                sus credenciales de acceso de manera segura.
                {"\n"}No utilizar RanchApp para actividades fraudulentas,
                ilegales o para infringir derechos de terceros.
                {"\n\n"}
                <Text style={styles.modalNumber}>
                  3. Registro y Cuenta de Usuario
                </Text>
                {"\n"}Para utilizar RanchApp, los usuarios deben iniciar sesión
                a través de Google OAuth, lo que permite un acceso seguro
                mediante la cuenta de Google del usuario. RanchApp no almacena
                directamente los datos personales del usuario; la autenticación
                y gestión de datos están a cargo de Google. Es responsabilidad
                del usuario proteger la seguridad de su cuenta de Google y
                notificar a Google en caso de actividad no autorizada.
                {"\n\n"}
                <Text style={styles.modalNumber}>
                  4. Privacidad y Protección de Datos
                </Text>
                {"\n"}RanchApp respeta la privacidad de sus usuarios y utiliza
                Google OAuth para la autenticación, por lo que la información de
                inicio de sesión y los datos personales del usuario son
                gestionados por Google, no por RanchApp. Asimismo, RanchApp
                utiliza el Google Calendar API y Google Maps API para
                funcionalidades específicas de la aplicación. La información
                recopilada mediante estas APIs se usa exclusivamente para el
                funcionamiento de RanchApp y no se comparte con terceros sin el
                consentimiento del usuario. Para más detalles sobre el manejo de
                datos personales, consulta la [Política de Privacidad de
                Google].
                {"\n\n"}
                <Text style={styles.modalNumber}>5. Pagos y Transacciones</Text>
                {"\n"}RanchApp permite la división de gastos entre los
                participantes de eventos mediante la integración con el sistema
                de pagos de Mercado Pago. El usuario comprende que:
                {"\n"}RanchApp actúa como intermediario en la organización y
                cálculo de los gastos, pero no es responsable de problemas
                derivados de los sistemas de pago externos.
                {"\n"}Cualquier problema o disputa relacionada con los pagos
                deberá ser gestionada directamente con Mercado Pago u otros
                proveedores de pagos utilizados por el usuario.
                {"\n\n"}
                <Text style={styles.modalNumber}>
                  6. Limitaciones y Exención de Responsabilidad
                </Text>
                {"\n"}RanchApp se proporciona "tal cual" y, en la medida
                permitida por la ley, no asume responsabilidad alguna por:
                {"\n"}Errores o fallos técnicos, interrupciones del servicio, o
                problemas derivados de la integración con APIs de terceros.
                {"\n"}Cualquier pérdida o daño resultante del uso incorrecto o
                no autorizado de RanchApp.
                {"\n"}La exactitud o disponibilidad de los servicios de
                geolocalización o las funciones de pago.
                {"\n\n"}
                <Text style={styles.modalNumber}>
                  7. Modificación de los Términos y Condiciones
                </Text>
                {"\n"}RanchApp se reserva el derecho de modificar estos Términos
                y Condiciones en cualquier momento. Las modificaciones serán
                publicadas en la aplicación, y se considerará que los usuarios
                aceptan los cambios si continúan utilizando RanchApp después de
                la publicación.
                {"\n\n"}
                <Text style={styles.modalNumber}>8. Contacto</Text>
                {"\n"}Si tienes preguntas o necesitas asistencia, puedes ponerte
                en contacto con nosotros a través de Ranchapp.ar@gmail.com
              </Text>
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutUsModalVisible}
        onRequestClose={() => setAboutUsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Sobre Nosotros</Text>
              <View style={styles.personContainer}>
                <Image
                  source={{ uri: "https://ranchapp.github.io/img/cesar.png" }}
                  style={styles.personImage}
                />
                <Text style={styles.personName}>César Rivero</Text>
                <Text style={styles.personDescription}>
                  "Con RanchApp, diseñamos una experiencia visual y de usuario
                  sencilla y divertida, para que organizar y disfrutar eventos
                  sea un placer."
                </Text>
              </View>
              <View style={styles.personContainer}>
                <Image
                  source={{
                    uri: "https://ranchapp.github.io/img/victoria.png",
                  }}
                  style={styles.personImage}
                />
                <Text style={styles.personName}>
                  Maria Victoria Payotte Ripa
                </Text>
                <Text style={styles.personDescription}>
                  "Nos enfocamos en cada detalle para convertir cada reunión en
                  una experiencia inolvidable."
                </Text>
              </View>
              <View style={styles.personContainer}>
                <Image
                  source={{ uri: "https://ranchapp.github.io/img/santino.png" }}
                  style={styles.personImage}
                />
                <Text style={styles.personName}>Santino Fazio</Text>
                <Text style={styles.personDescription}>
                  "RanchApp conecta a las personas de manera fluida, haciendo
                  que cada evento sea fácil de planificar y memorable de vivir."
                </Text>
              </View>
              <View style={styles.personContainer}>
                <Image
                  source={{ uri: "https://ranchapp.github.io/img/ignacio.png" }}
                  style={styles.personImage}
                />
                <Text style={styles.personName}>Ignacio Armendariz</Text>
                <Text style={styles.personDescription}>
                  "Creamos una tecnología sólida que garantiza una experiencia
                  sin interrupciones, para que cada evento sea perfecto."
                </Text>
              </View>
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setAboutUsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1b1b1b",
  },
  userInfoText: {
    fontSize: 16,
    color: "white",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "contain",
  },
  profileImageLogo: {
    width: 50,
    height: 50,
    borderRadius: 5,
    resizeMode: "contain",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center", // Centrar la imagen dentro del contenedor
    marginVertical: 10, // Añadir margen vertical para separar la imagen del texto
  },
  button: {
    backgroundColor: "#3498db",
    padding: 8,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  userInfo: {
    paddingVertical: 20,
    paddingHorizontal: 50,
    backgroundColor: "#1b1b1b",
    borderWidth: 5, // Ancho del borde
    borderColor: "#000", // Color del borde
    borderRadius: 10,
  },
  footerText: {
    color: "white",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  footerContainer: {
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginTop: 40,
    marginBottom: 120,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
  },
  closeButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#1b1b1b",
    fontWeight: "bold",
  },
  personContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  personImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  personName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  personDescription: {
    fontSize: 16,
    textAlign: "center",
  },
});
export default UserInfo;
