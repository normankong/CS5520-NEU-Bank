import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Image, ToastAndroid, Alert, Modal, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as Google from "expo-google-app-auth";

// LinkedIn Signin
// import {LinkedInOAuth} from "react-native-linkedin-oauth"
import LinkedInModal, { fetchToken } from "rn-linkedin-login"

import neuHelper from '../../common/neuHelper';
import apiConfig from '../../common/apiConfig';
import apiHelper from '../../common/apiHelper';

const Screen = ({ navigation }) => {

  const [isLogin, setLogin] = useState(false)
  const [isLinkedInLogin, showLinkedInLogin] = useState(false)
  const linkedInLoginPage = useRef(null)

  const signInAsync = async () => {
    try {
      setLogin(true);
      const { type, user } = await Google.logInAsync({
        androidClientId: apiConfig.ANDROID_CLIENT_ID,
      });

      if (type === "success") {
        console.log(user)
        let data = await apiHelper.getAccountSummary(user);
        if (data.length == 0) {
          alert("To enjoy NEU Bank service, please open an account with us");
          setLogin(false);
        }
        else {
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

  const linkedin_signin = () => {
    console.log("changed")
    console.log(isLinkedInLogin)
    showLinkedInLogin(!isLinkedInLogin);
  }

  const linkedin_signin_success_handler = async (result: any) => {
    console.log("[LinkedIn Succ] ", result)
    // console.log(fetchToken(result.access_token))
    let header = new Headers();
    header.set('Authorization', 'Bearer ' + result.access_token);
    // PROFILE
    let profile = await fetch("https://api.linkedin.com/v2/me", {
      method: 'GET',
      headers: header
    }).then(response => response.json()).catch(err => console.log("fetch profile failed: " + err));
    // console.log(profile)
    // EMAIL
    let email = await fetch("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
      method: 'GET',
      headers: header
    }).then(response => response.json()).catch(err => console.log("fetch email failed: " + err));
    // console.log(email.elements[0]["handle~"].emailAddress)
    // picture
    let profileImage = await fetch("https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))", {
      method: 'GET',
      headers: header
    }).then(response => response.json()).catch(err => console.log("fetch profile image failed: " + err));
    // console.log(profileImage.profilePicture["displayImage~"].elements[0].identifiers[0].identifier)
    let user = {
      "email": email.elements[0]["handle~"].emailAddress,
      "familyName": profile.localizedLastName,
      "givenName": profile.localizedFirstName,
      "id": profile.id,
      "name": profile.localizedFirstName + " " + profile.localizedLastName,
      "photoUrl": profileImage.profilePicture["displayImage~"].elements[0].identifiers[0].identifier,
    }
    console.log(user)
    setLogin(true);
    let data = await apiHelper.getAccountSummary(user);
    if (data.length == 0) {
      alert("To enjoy NEU Bank service, please open an account with us");
      setLogin(false);
    }
    else {
      neuHelper.setUser(user);
      navigation.navigate("PostLoginScreen");
    }
  };

  const linkedin_signin_fail_handler = (fail: any) => {
    console.log("[LinkedIn Failed] ", fail)
    Alert.alert("Linked login failed!")
  }

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
        <LinkedInModal
          clientID="86c1nrasoa623w"
          clientSecret="Fnt1XPi2ZTk7uB3r"
          redirectUri="http://192.168.1.160:19000"
          onSuccess={(data) => linkedin_signin_success_handler(data)}
          onError={(data) => linkedin_signin_fail_handler(data)}
          animationType="slide"
          authState="random state"
          permissions={["r_liteprofile", "r_emailaddress"]}
        />
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
    width: 188,
    height: 47,
    marginTop: 10
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