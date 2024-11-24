import React from "react";
import "react-native-gesture-handler";
import { StyleSheet, View, Button } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
import Header from "./components/Header";
import Login from "./components/Login";
// import EventList from "./components/EventList";
// import EventDetails from "./components/EventDetails";
// import EventFormWrapper from "./components/EventFormWrapper";
import { AuthProvider } from "./context/AuthContext";

// const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      {/* <NavigationContainer> */}
      <View style={styles.container}>
        <Header />
        <Login />
        {/* <Button
            title="Crear Evento"
            onPress={() => navigation.navigate("CreateEvent")}
          />
          <Stack.Navigator initialRouteName="EventList">
            <Stack.Screen name="EventList" component={EventList} />
            <Stack.Screen name="EventDetails" component={EventDetails} />
            <Stack.Screen name="CreateEvent">
              {(props) => <EventFormWrapper {...props} isEdit={false} />}
            </Stack.Screen>
            <Stack.Screen name="EditEvent">
              {(props) => <EventFormWrapper {...props} isEdit={true} />}
            </Stack.Screen>
          </Stack.Navigator> */}
      </View>
      {/* </NavigationContainer> */}
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1b1b1b",
  },
});

export default App;
