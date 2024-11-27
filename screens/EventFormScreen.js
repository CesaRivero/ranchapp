import { View, StyleSheet } from "react-native";
import EventFormWrapper from "../components/EventFormWrapper";
import { useRoute } from "@react-navigation/native";
const EventFormScreen = ({ idEdit }) => {
  const route = useRoute();

  return (
    <View style={styles.container}>
      <EventFormWrapper isEdit={idEdit} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
  },
});
export default EventFormScreen;
