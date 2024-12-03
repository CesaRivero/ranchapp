import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import EventList from "../components/EventList";
import { ScrollView } from "react-native-gesture-handler";
import PullToRefreshWrapper from "../components/PullToRefreshWrapper";
const MainScreen = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshScreen = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <PullToRefreshWrapper onRefresh={refreshScreen}>
        <View key={refreshKey} style={styles.container}>
          <ScrollView>
            <Login />
            {isAuthenticated && (
              <>
                <EventList />
              </>
            )}
          </ScrollView>
        </View>
      </PullToRefreshWrapper>
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
