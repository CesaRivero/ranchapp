import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import MainContent from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "./services/notificationSetup";
import { lightTheme, darkTheme } from "./Theme";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { useColorScheme } from "react-native";

const App = () => {
  const colorScheme = useColorScheme();
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  console.log("Light Theme: ", lightTheme);
  console.log("Dark Theme: ", darkTheme);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer
            theme={colorScheme === "dark" ? darkTheme : darkTheme}
          >
            <MainContent />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
