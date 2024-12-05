// notificationSetup.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function scheduleNotification(event) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Nuevo Evento",
      body: `Tienes un nuevo evento: ${event.summary}`,
    },
    trigger: { seconds: 2 }, // Puedes ajustar el tiempo de la notificación
  });
}

export async function scheduleEditNotification(eventTitle) {
  console.log("Evento actualizado dentreo de noticonfig:", eventTitle);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Evento Actualizado",
      body: `El evento ${eventTitle} ha sido actualizado.`,
    },
    trigger: { seconds: 2 }, // Puedes ajustar el tiempo de la notificación
  });
}

export async function scheduleDeleteNotification(eventTitle) {
  console.log(
    `El evento ${eventTitle} ha sido eliminado dentro de confignoti.`
  );
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Evento Eliminado",
      body: `El evento ${eventTitle} ha sido eliminado.`,
    },
    trigger: { seconds: 2 }, // Puedes ajustar el tiempo de la notificación
  });
}
