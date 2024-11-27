import { useContext, useEffect } from "react";
import "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./Header";
import MainScreen from "../screens/MainScreen";
import EventDetails from "./EventDetails";
import EventFormWrapper from "./EventFormWrapper";
import { AuthContext } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import EventFormScreen from "../screens/EventFormScreen";

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
              height: 256,
              backgroundColor: "#1b1b1b", // Fondo del encabezado
              shadowColor: "transparent", // Eliminar sombra en iOS
              elevation: 0, // Eliminar sombra en Android
              borderBottomWidth: 0,
            },
          }}
        />

        {isAuthenticated && (
          <>
            <Stack.Screen
              name="EventDetailsScreen"
              component={EventDetailsScreen}
            />
            <Stack.Screen name="CreateEvent">
              {(props) => <EventFormScreen {...props} isEdit={false} />}
            </Stack.Screen>
            <Stack.Screen name="EditEvent">
              {(props) => <EventFormScreen {...props} isEdit={true} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
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
