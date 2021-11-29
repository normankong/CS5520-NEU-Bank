import React, {useEffect, useState, useRef} from "react";
import {StyleSheet, View, Image, ToastAndroid, Alert, Modal, Text} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
// FB sign in library
import * as Facebook from 'expo-facebook';

import * as Google from "expo-google-app-auth";

// LinkedIn Signin
// import {LinkedInOAuth} from "react-native-linkedin-oauth"
import LinkedInModal, {fetchToken} from "rn-linkedin-login"

import neuHelper from '../../common/neuHelper';
import apiConfig from '../../common/apiConfig';
import apiHelper from '../../common/apiHelper';

const Screen = ({navigation}) => {

    const [isLogin, setLogin] = useState(false)
    const [isLinkedInLogin, showLinkedInLogin] = useState(false)
    const linkedInLoginPage = useRef(null)

    const [isLoggedin, setLoggedinStatus] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isImageLoading, setImageLoadStatus] = useState(false);


    const signInAsync = async () => {
        try {
            setLogin(true);
            const {type, user} = await Google.logInAsync({
                androidClientId: apiConfig.ANDROID_CLIENT_ID,
            });

            if (type === "success") {
                console.log(user)
                let data = await apiHelper.getAccountSummary(user);
                if (data.length == 0) {
                    alert("To enjoy NEU Bank service, please open an account with us");
                    setLogin(false);
                } else {
                    neuHelper.setUser(user);
                    navigation.navigate("PostLoginScreen");
                }
            } else {
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
        let data = await apiHelper.getAccountSummary(user); // same
        if (data.length == 0) {
            alert("To enjoy NEU Bank service, please open an account with us");
            setLogin(false);
        } else {
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
        <View style={styles.separator}/>
    );

    // facebook login
    async function logIn() {
        try {
            await Facebook.initializeAsync({
                appId: '594918918390788',
            });
            const {
                type,
                token,
                expirationDate,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                // fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
                //     .then(response => response.json())
                //     .then(data => {
                //         setLoggedinStatus(true);
                //         setUserData(data);
                //     })
                //     .catch(e => console.log(e))
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);

                let id = await fetch(
                    `https://graph.facebook.com/me?access_token=${token}&fields=id`
                );
                let name = await fetch(
                    `https://graph.facebook.com/me?access_token=${token}&fields=name`
                );
                let email = await fetch(
                    `https://graph.facebook.com/me?fields=email&access_token=${token}`
                );
                let picture = await fetch(
                    `https://graph.facebook.com/me?access_token=${token}&fields=picture.type(large)`
                );
                let userID = await id.json();
                let userName = await name.json();
                let userEmail = await email.json();
                let userPicture = await picture.json();
                // console.log(userName);
                // console.log(userEmail);
                // console.log(userPicture);

                let user = {
                    "email": userEmail.email,
                    "id": userID.id,
                    "name": userName.name,
                    "photoUrl": userPicture.picture.data.url,
                }
                // console.log(user);

                setLogin(true);
                let data = await apiHelper.getAccountSummary(user);
                if (data.length == 0) {
                    alert("To enjoy NEU Bank service, please open an account with us");
                    setLogin(false);
                } else {
                    neuHelper.setUser(user);
                    navigation.navigate("PostLoginScreen");
                }
            } else {
                // type === 'cancel'
            }
        } catch ({message}) {
            alert(`Facebook Login Error: ${message}`);
        }
    }


    return (
        isLogin ? <></> :
            <View style={styles.container}>
                <Image source={require('../../assets/images/splash.png')} style={styles.image}/>
                <TouchableOpacity onPress={signInAsync}>
                    <Image source={require('../../assets/images/signin.png')} style={styles.signin}/>
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

                <TouchableOpacity onPress={logIn} style={styles.fbLoginBtn}>
                    <Text style={{color: "#fff"}}>Login with Facebook</Text>
                </TouchableOpacity>


                <Separator/>
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
    fbLoginBtn: {
        backgroundColor: '#4267b2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20
    },


});
