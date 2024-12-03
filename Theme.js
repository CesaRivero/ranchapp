// theme.js
import { DefaultTheme } from "@react-navigation/native";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#1b1b1b",
    text: "#fff",
    textMain: "#1b1b1b",
    button: "#145da0",
  },
  fonts: {
    regular: "Roboto_400Regular",
    bold: "Roboto_700Bold",
  },
};
