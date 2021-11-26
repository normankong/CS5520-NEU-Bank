import Constants from 'expo-constants';
import Session from "react-session-api";
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

class NeuHelper {

    isLogin = () => {
        console.log(Session.get("USER"));
        return (Session.get("USER") != undefined);
    }

    setUser = (user) => {
        console.log("Updating User", user);
        Session.set("USER", user);
    }

    getUser = () => {
        return Session.get("USER");
    }

    setPNToken = (token) => {
        console.log("Updating PN Token", token);
        return Session.set("PN_TOKEN", token);
    }

    getPNToken = () => {
        return Session.get("PN_TOKEN");
    }

    registerPN = async () => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            let token = (await Notifications.getExpoPushTokenAsync()).data;
            this.setPNToken(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }
}

export default new NeuHelper();
