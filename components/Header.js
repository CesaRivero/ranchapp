import React from "react";
import { View, Image, StyleSheet } from "react-native";
import imageLogo from "../assets/logo.png";
import { useTheme } from "@react-navigation/native";

function Header() {
  const { colors, fonts } = useTheme();
  const styles = StyleSheet.create({
    header: {
      width: "100%",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.background,
    },
    logo: {
      width: 250,
      height: 200,
      resizeMode: "contain",
    },
  });
  return (
    <View style={styles.header}>
      <Image source={imageLogo} style={styles.logo} />
    </View>
  );
}

export default Header;
