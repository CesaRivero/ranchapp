import { View, StyleSheet } from "react-native";
import EventDetails from "../components/EventDetails";
import { useRoute } from "@react-navigation/native";
import PullToRefreshWrapper from "../components/PullToRefreshWrapper";
import { useState } from "react";

const EventDetailsScreen = () => {
  const route = useRoute();
  const { id } = route.params;
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshScreen = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PullToRefreshWrapper onRefresh={refreshScreen}>
      <View key={refreshKey} style={styles.container}>
        <EventDetails id={id} />
      </View>
    </PullToRefreshWrapper>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
});
export default EventDetailsScreen;
