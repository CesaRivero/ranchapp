import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import theme from "../Theme";
import { useTheme } from "@react-navigation/native";
const PullToRefreshWrapper = ({ children, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { colors, fonts } = useTheme();

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh(); // Llamamos a la función de refresco que pase cada pantalla
    }
    setRefreshing(false);
  };

  return (
    <FlatList
      data={[]} // FlatList necesita data, pero aquí no se muestra nada.
      keyExtractor={() => "dummy"} // Llave ficticia para evitar errores
      renderItem={null} // No renderiza ítems; solo envuelve el contenido
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.button]} // Rojo en Android
          progressBackgroundColor={colors.background} // Fondo gris claro en Android
          tintColor="#ff0000" // Rojo en iOS
        />
      }
      ListHeaderComponent={
        <>{children}</> // Renderiza los hijos del componente aquí
      }
    />
  );
};

export default PullToRefreshWrapper;

const styles = StyleSheet.create({});
