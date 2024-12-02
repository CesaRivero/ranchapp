import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import EventList from "../components/EventList";
import { ScrollView } from "react-native-gesture-handler";

const MainScreen = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Login />
          {isAuthenticated && (
            <>
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
});
export default MainScreen;
