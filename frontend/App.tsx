import "react-native-gesture-handler";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

// Screens
import PreLoginScreen     from "./screens/prelogin";
import PostLoginScreen    from "./screens/postlogin";

//React Navigation Setup
import { NavigationContainer } from "@react-navigation/native";

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PreLoginScreen">
          <Stack.Screen name="PreLoginScreen" component={PreLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PostLoginScreen" component={PostLoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
