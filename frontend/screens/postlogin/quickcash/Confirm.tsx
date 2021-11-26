import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { captureScreen } from 'react-native-view-shot';
import * as Sharing from "expo-sharing";
import { AntDesign } from '@expo/vector-icons';

import { styles } from './styles'

import apiHelper from '../../../common/apiHelper';
import neuHelper from '../../../common/neuHelper'

export default function ConfirmScreen(navigation) {

  const user = neuHelper.getUser();
  const token = neuHelper.getPNToken();
  const item = navigation.route.params;
  const [isScreenCapturing, setScreenCapturing] = useState(false);
  const [isScreenCaptured, setScreenCaptured] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleAccountSummary = () => {
    navigation.navigation.navigate("DashboardScreen");
  }

  const handleWithdrawAgain = () => {
    navigation.navigation.navigate("QuickCashScreen");
  }

  const proceedQuickCash = async () => {
    try {
      let data = await apiHelper.proceedQuickCash(user, token, item);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    proceedQuickCash();
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }, []);

  const captureAndShareScreenshot = async () => {
    setScreenCapturing(true)
    setTimeout(capture, 500);
  }

  const capture = async () => {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    }).then(
      (uri) => {

        Sharing.shareAsync(uri);
      },
      (error) => console.error('Oops, Something Went Wrong', error),
    );
    setScreenCapturing(false);
    setScreenCaptured(true);
  }

  const MainScreen = () => {

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: "white", flexDirection: "row" }}>
          <Text style={{ margin: 10, marginTop: 30, fontSize: 22 }}>Confirm</Text>
          {isScreenCapturing ? <></> :
            <TouchableOpacity onPress={captureAndShareScreenshot}>
              <AntDesign style={{ marginLeft: 250, marginTop: 38 }} name="sharealt" size={24} color="black" />
            </TouchableOpacity>
          }
        </View>

        <View style={{ marginTop: 30, justifyContent: "center", alignItems: 'center' }}>
          <Text>Your instruction have been accepted</Text>

          <View>
            {isScreenCapturing || isScreenCaptured ?
              <LottieView
                source={require("../../../assets/lottie/confirm.json")}
                style={styles.animation}
                progress={1000}
              />
              :
              <LottieView
                source={require("../../../assets/lottie/confirm.json")}
                style={styles.animation}
                autoPlay={true}
                loop={false}
                progress={1000}
              />
            }
          </View>

          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>Transaction Reference</DataTable.Cell>
              <DataTable.Cell numeric>
                {data.txnRefNum}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Date/Time</DataTable.Cell>
              <DataTable.Cell numeric>
                {data.timestamp}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>From</DataTable.Cell>
              <DataTable.Cell numeric>
                {item.accountNumber}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Location</DataTable.Cell>
              <DataTable.Cell numeric>
                {item.qrCode.name}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Withdraw Amount</DataTable.Cell>
              <DataTable.Cell numeric>
                {item.amount} {item.accountCurrency}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Print Receipt</DataTable.Cell>
              <DataTable.Cell numeric>
                {item.isReceiptOn ? "Yes" : "No"}
              </DataTable.Cell>
            </DataTable.Row>

          </DataTable>

          <Text style={{ margin: 20 }}>Please collect the cash from the ATM machine</Text>
        </View>

        {isScreenCapturing ? <></> :
          <View style={{ marginTop: 100, marginHorizontal: 20 }} >
            <Button mode="contained" onPress={handleAccountSummary} uppercase={false} style={styles.ctaButton}>
              Back to Account Summary
            </Button>
            <Button mode="outlined" onPress={handleWithdrawAgain} uppercase={false} style={styles.normalButton}>
              Withdraw again
            </Button>
          </View>
        }


      </View>
    )
  }

  return (
    isLoading ? <ActivityIndicator /> : <MainScreen />
  );
}