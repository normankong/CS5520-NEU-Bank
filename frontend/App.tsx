import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}


// import * as React from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { Button, View } from 'react-native';
// import apiHelper from './common/apiHelper';
// import { Image, StyleSheet, Text, ToastAndroid } from 'react-native';

// WebBrowser.maybeCompleteAuthSession();

// export default function App() {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: '306785828392-ekoicng2uojrgh9g4g5hljf45pamsiei.apps.googleusercontent.com',
//     iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
//     androidClientId: '306785828392-3dj1r2krqfipt9cn9c330jaj0pjdmv1d.apps.googleusercontent.com',
//     webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
//   });

//   const [name, setName] = React.useState(null);

//   React.useEffect(() => {
//     (async () => {

//       if (response?.type === 'success') {
//         const { authentication } = response;
//         console.log(response)
//         let profile = await apiHelper.getUserInfo(response.authentication.accessToken);
//         ToastAndroid.show(`Welcome ${profile.given_name}`, ToastAndroid.SHORT);
//         setName(profile.given_name);
//       }
//     })();
//   }, [response]);

//   const Separator = () => (
//     <View style={styles.separator} />
//   );

//   return (
//     <View style={styles.container}>
//       <Image source={require('./assets/images/splash.png')} style={styles.image} />
//       <Button
//         disabled={!request}
//         title="Login"
//         onPress={() => {
//           promptAsync();
//         }}
//       />

//       <Separator/>
//       {(name == null) ? <View /> : <Text style={styles.text}>Welcome {name}</Text>}

//     </View>
//   );

// }

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     marginHorizontal: 40,
//   },

//   image: {
//     width: 300,
//     height: 300
//   },

//   text: {
//     height: 40,
//     width: 300,
//     textAlign: 'center', 
//   },

//   separator: {
//     marginVertical: 8,
//     // borderBottomColor: '#737373',
//     // borderBottomWidth: StyleSheet.hairlineWidth,
//   },

// });