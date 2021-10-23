import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import InsuranceScreen from '../screens/Insurance/Insurance';
import InvestmentScreen from '../screens/Investment/Investment';

import ATMLocationScreen from '../screens/ATMBranch/ATMLocation';

import QuickCashInputScreen from '../screens/QuickCash/Input';
import QuickCashVerifyScreen from '../screens/QuickCash/Verify';
import QuickCashConfirmScreen from '../screens/QuickCash/Confirm';

import AccountSummary from '../screens/MyAccount/AccountSummary';
import AccountDetailScreen from '../screens/MyAccount/AccountDetail';

import { RootStackParamList, RootTabParamList } from '../types';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ title: 'Transaction History' }} />

      <Stack.Screen name="QuickCashVerify" component={QuickCashVerifyScreen} options={{ title: 'Verify Detail' , headerShown: false}} />
      <Stack.Screen name="QuickCashConfirm" component={QuickCashConfirmScreen} options={{ title: 'Confirm Detail',  headerShown: false }}  />

      <Stack.Screen name="ATMLocation" component={ATMLocationScreen} options={{ title: 'ATM Location' }} />

    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {

  return (
    <BottomTab.Navigator initialRouteName="AccountSummary">
      <BottomTab.Screen
        name="AccountSummary"
        component={AccountSummary}
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
      <BottomTab.Screen
        name="Investment"
        component={InvestmentScreen}
        options={{
          title: 'Investment',
          headerShown: true,
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Insurance"
        component={InsuranceScreen}
        options={{
          title: 'Insurance',
          headerShown: true,
          tabBarIcon: ({ color }) => <TabBarIcon name="hospital-o" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="QuickCash"
        component={QuickCashInputScreen}
        options={{
          title: 'Quick Cash',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
