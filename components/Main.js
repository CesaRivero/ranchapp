import { useContext, useEffect } from "react";
import "react-native-gesture-handler";
import { StyleSheet, View, Pressable, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./Header";
import MainScreen from "./MainScreen";
import EventList from "./EventList";
import EventDetails from "./EventDetails";
import EventFormWrapper from "./EventFormWrapper";
import { AuthContext } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createStackNavigator();

const MainContent = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log(
      "isAuthenticated en el componente MainContent (useEffect):",
      isAuthenticated
    );
  }, [isAuthenticated]);

  console.log("isAuthenticated en el componente mainCOntent:", isAuthenticated);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* <ScrollView> */}
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1b1b1b", // Fondo del encabezado
            height: 100,
            shadowColor: "transparent", // Eliminar sombra en iOS
            elevation: 0, // Eliminar sombra en Android
            borderBottomWidth: 0, // Eliminar borde inferior
          },
          headerTintColor: "#fff", // Color del texto del encabezado
          headerTitleStyle: {
            fontWeight: "bold", // Estilo del título del encabezado
          },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{
            headerTitle: (props) => <Header {...props} />,
            headerStyle: {
              height: 230,
              backgroundColor: "#1b1b1b", // Fondo del encabezado
              shadowColor: "transparent", // Eliminar sombra en iOS
              elevation: 0, // Eliminar sombra en Android
              borderBottomWidth: 0,
            },
          }}
        />

        {isAuthenticated && (
          <>
            <Stack.Screen name="EventList" component={EventList} />
            <Stack.Screen name="EventDetails" component={EventDetails} />
            <Stack.Screen name="CreateEvent">
              {(props) => <EventFormWrapper {...props} isEdit={false} />}
            </Stack.Screen>
            <Stack.Screen name="EditEvent">
              {(props) => <EventFormWrapper {...props} isEdit={true} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>

      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: "#1b1b1b",
  },
});
export default MainContent;
