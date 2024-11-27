import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Header from "./Header";
import Login from "./Login";
import EventList from "./EventList";
import { ScrollView } from "react-native-gesture-handler";

const MainScreen = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          {/* <Header /> */}
          <Login />
          {isAuthenticated && (
            <>
              <Pressable
                style={styles.button}
                onPress={() => navigation.navigate("CreateEvent")}
              >
                <Text>Crear Evento</Text>
              </Pressable>
              <EventList />
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "#1b1b1b",
  },
  button: {
    backgroundColor: "#3498db", //seria el color azul mepa validar luego
    padding: 8,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
});
export default MainScreen;
