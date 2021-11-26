import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, ToastAndroid, Alert} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as Google from "expo-google-app-auth";

import neuHelper from '../../common/neuHelper';
import apiConfig from '../../common/apiConfig';
import apiHelper from '../../common/apiHelper';

const Screen = ({ navigation }) => {

  const [isLogin, setLogin] = useState(false)

  const signInAsync = async () => {
    try {
      setLogin(true);
      const { type, user } = await Google.logInAsync({
        androidClientId: apiConfig.ANDROID_CLIENT_ID,
      });

      if (type === "success") {
        let data = await apiHelper.getAccountSummary(user);
        if (data.length == 0){
          alert("To enjoy NEU Bank service, please open an account with us");
          setLogin(false);
        }
        else{
          neuHelper.setUser(user);
          navigation.navigate("PostLoginScreen");
        }
      }
      else {
        ToastAndroid.show('You have cancelled the login !', ToastAndroid.SHORT);
        setLogin(false);
      }
    } catch (error) {
      console.log("Login failure", error);
    }
  };

  useEffect(() => {
    (async () => {
      await neuHelper.registerPN();
    })();
  }, []);

  const Separator = () => (
    <View style={styles.separator} />
  );

  return (
    isLogin ? <></> : 
    <View style={styles.container}>
      <Image source={require('../../assets/images/splash.png')} style={styles.image} />
      <TouchableOpacity onPress={signInAsync}>
        <Image source={require('../../assets/images/signin.png')} style={styles.signin} />
      </TouchableOpacity>
      <Separator />
    </View>
  )
};

export default Screen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 300,
    height: 300
  },

  signin: {
  },

  text: {
    height: 40,
    width: 300,
    textAlign: 'center',
  },

  separator: {
    marginVertical: 8,
  },

});