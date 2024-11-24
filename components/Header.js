import React from "react";
import { View, Image, StyleSheet } from "react-native";
import imageLogo from "../assets/logo.png";

function Header() {
  return (
    <View style={styles.header}>
      <Image source={imageLogo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  logo: {
    width: 250,
    height: 200,
  },
});

export default Header;
