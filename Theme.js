// theme.js
import { DefaultTheme, DarkTheme } from "@react-navigation/native";

// export const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: "#1b1b1b",
//     text: "#fff",
//     textMain: "#1b1b1b",
//     button: "#145da0",
//   },
//   fonts: {
//     regular: "Roboto_400Regular",
//     bold: "Roboto_700Bold",
//   },
// };

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff", // Fondo claro
    text: "#000000", // Texto oscuro
    textMain: "#ffffff", // Texto principal para botones
    button: "#145da0", // Botones
    border: "#d1d1d1", // Borde para componentes
    card: "#f5f5f5", // Fondo de tarjetas
    primary: "#145da0", // Color principal
  },
  fonts: {
    regular: "Roboto_400Regular",
    bold: "Roboto_700Bold",
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
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
export { lightTheme, darkTheme };
