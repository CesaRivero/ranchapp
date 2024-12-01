import { View, StyleSheet } from "react-native";
import UserInfo from "../components/UserInfo";

const UserScreen = () => {
  return (
    <View style={styles.container}>
      <UserInfo />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1b1b1b",
    flex: 1,
  },
});
export default UserScreen;
