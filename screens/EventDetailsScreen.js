import { View, StyleSheet } from "react-native";
import EventDetails from "../components/EventDetails";
import { useRoute } from "@react-navigation/native";
const EventDetailsScreen = () => {
  const route = useRoute();
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <EventDetails id={id} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
});
export default EventDetailsScreen;
