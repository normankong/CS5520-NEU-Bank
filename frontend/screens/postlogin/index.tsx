import "react-native-gesture-handler";
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import neuHelper from '../../common/neuHelper';

const Stack = createNativeStackNavigator();

import PreLoginScreen from "../prelogin";

// Screens
import DashboardScreen from "./dashboard";
import InvestmentScreen from "./investment";
import InsuranceScreen from "./insurance";
import QuickCashScreen from "./quickcash";
import FinanceScreen from "./finance";

// Dashboard
import AccountTxnScreen from "./dashboard/AccountTxn";

// QuickCash
import QuickCashVerifyScreen from "./quickcash/Verify";
import QuickCashConfirmScreen from "./quickcash/Confirm";
import ATMLocationScreen from "./quickcash/ATMLocation";

//React Navigation Setup
import { NavigationContainer } from "@react-navigation/native";

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="AccountTxnScreen" component={AccountTxnScreen} options={{ title: 'Transaction History' }} />

      <Stack.Screen name="QuickCashVerifyScreen" component={QuickCashVerifyScreen} options={{ title: 'Verify Detail', headerShown: false }} />
      <Stack.Screen name="QuickCashConfirmScreen" component={QuickCashConfirmScreen} options={{ title: 'Confirm Detail', headerShown: false }} />

      <Stack.Screen name="ATMLocationScreen" component={ATMLocationScreen} options={{ title: 'ATM Location' }} />
      <Stack.Screen name="PreLoginScreen" component={PreLoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PostLoginScreen" component={Screen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}



const Screen = ({ route, navigation }) => {

  return (
    <NavigationContainer independent={true}>
      <RootNavigator />
    </NavigationContainer>
  );

};

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {

  const user = neuHelper.getUser();

  if (isFacebook(user)) {
    return (
      <BottomTab.Navigator initialRouteName="DashboardScreen">
        <BottomTab.Screen
          name="DashboardScreen"
          component={DashboardScreen}
          options={{
            title: 'Account',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
          }}
        />
        <BottomTab.Screen
          name="InvestmentScreen"
          component={InvestmentScreen}
          options={{
            title: 'Investment',
            headerShown: true,
            tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="InsuranceScreen"
          component={InsuranceScreen}
          options={{
            title: 'Insurance',
            headerShown: true,
            tabBarIcon: ({ color }) => <TabBarIcon name="hospital-o" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="QuickCashScreen"
          component={QuickCashScreen}
          options={{
            title: 'Quick Cash',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
          }}
        />
      </BottomTab.Navigator>
    );
  }
  else {
    return (
      <BottomTab.Navigator initialRouteName="DashboardScreen">
        <BottomTab.Screen
          name="DashboardScreen"
          component={DashboardScreen}
          options={{
            title: 'Account',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
          }}
        />
        <BottomTab.Screen
          name="FinanceScreen"
          component={FinanceScreen}
          options={{
            title: 'Finance',
            headerShown: true,
            tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="QuickCashScreen"
          component={QuickCashScreen}
          options={{
            title: 'Quick Cash',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
          }}
        />
      </BottomTab.Navigator>
    );
  }
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

function isFacebook(user) {
  return (user.source == "facebook");
}

export default Screen;


