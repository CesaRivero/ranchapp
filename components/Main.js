import { useContext, useEffect } from "react";
import "react-native-gesture-handler";
import { StyleSheet, View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./Header";
import MainScreen from "../screens/MainScreen";
import { AuthContext } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import EventFormScreen from "../screens/EventFormScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "../screens/UserScreen";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainContent = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const MainStackNavigator = () => (
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
        headerShown: true,
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

      <Stack.Screen
        name="EventDetailsScreen"
        component={EventDetailsScreen}
        options={{ title: "Detalles del evento" }}
      />
      <Stack.Screen name="CreateEvent">
        {(props) => <EventFormScreen {...props} isEdit={false} />}
      </Stack.Screen>
      <Stack.Screen name="EditEvent">
        {(props) => <EventFormScreen {...props} isEdit={true} />}
      </Stack.Screen>
      <Stack.Screen
        name="UserInfo"
        component={UserScreen}
        options={{ title: "Informacion de usuario" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar style="light" />
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "#1b1b1b", // Fondo del encabezado
              shadowColor: "transparent", // Eliminar sombra en iOS
              elevation: 0, // Eliminar sombra en Android
              borderBottomWidth: 0,
            },
            headerTintColor: "#fff", // Color del texto del encabezado
            headerTitleStyle: {
              // fontWeight: "", // Estilo del título del encabezado
            },
            headerTitleAlign: "center",
            tabBarStyle: {
              backgroundColor: "#3498db", // Fondo de la barra de pestañas
              height: 60,
              borderRadius: 50,
            },
            tabBarIconStyle: {
              justifyContent: "center", // Centra los iconos verticalmente
              alignItems: "center", // Centra los iconos verticalmente
              width: "100%",
              height: "100%",
            },
            tabBarActiveTintColor: "#1b1b1b", // Color de los iconos y texto activos
            tabBarInactiveTintColor: "#888",
            tabBarShowLabel: false,
          }}
          screenListeners={({ navigation, route }) => ({
            tabPress: (e) => {
              if (route.name === "MainStack") {
                e.preventDefault();
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "MainStack" }],
                  })
                );
              }
            },
          })}
        >
          <Tab.Screen
            name="MainStack"
            component={MainStackNavigator}
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Entypo name="home" size={size + 5} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="CreateEvent"
            component={(props) => <EventFormScreen {...props} isEdit={false} />}
            options={{
              title: "Crear Evento",
              headerShown: true,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome6
                  name="circle-plus"
                  size={size + 5}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="UserInfo"
            component={UserScreen}
            options={{
              title: "Informacion de usuario",
              headerShown: true,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="user" size={size + 5} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <MainStackNavigator />
      )}
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
