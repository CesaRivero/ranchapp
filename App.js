import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import MainContent from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <MainContent />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
