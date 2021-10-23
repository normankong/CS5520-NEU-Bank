import React, { useState, useEffect } from 'react';

import { StyleSheet, Pressable, ToastAndroid, ActivityIndicator, FlatList } from 'react-native';
import { Icon } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { BottomSheet } from 'react-native-btr';
import { Text, View } from '../../components/Themed';

import { DataTable, Button, Switch } from 'react-native-paper';
import * as Brightness from 'expo-brightness';

import { styles } from './styles'
import apiHelper from '../../common/apiHelper'

export default function QuickWithdrawScreen(navigation) {

  const TARGET_BRIGHTNESS = 0.8;
  const BASE_CURRENCY = "CAD";

  const [hasPermission, setHasPermission] = useState(false);
  const [amount, setAmount] = useState(100);
  const [isReceiptOn, setIsReceiptOn] = useState(true);
  const [visible, setVisible] = useState(false);
  const [accountIdx, setAccountIdx] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [brightness, setBrightness] = useState(0.2);

  const onToggleReceipt = () => setIsReceiptOn(!isReceiptOn);

  const getAccountSummary = async () => {
    try {
      let data = await apiHelper.getAccountSummary();
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAccountSummary();

    // Initialize the BarCodeScanner
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Initialize the Brightness
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {

        let brightness = await Brightness.getBrightnessAsync();
        console.log(`Setting brightness : ${brightness} --> ${TARGET_BRIGHTNESS}`);
        setBrightness(brightness);
        Brightness.setSystemBrightnessAsync(TARGET_BRIGHTNESS);
      }
    })();

  }, []);

  const showMap = () => {
    navigation.navigation.navigate("ATMLocation");
  }

  const handleBarCodeScanned = (qrInfo) => {

    let qrCodeJson = null;
    try {
      console.log(qrInfo.data)
      qrCodeJson = JSON.parse(qrInfo.data);
    }
    catch (exception) {
      ToastAndroid.show('QR Code is not in correct formated', ToastAndroid.SHORT);
      return;
    }

    let reqObj = {
      accountNumber: data[accountIdx].accountNumber,
      accountCurrency: data[accountIdx].accountCurrency,
      accountDescription: data[accountIdx].accountDescription,
      amount: amount,
      isReceiptOn: isReceiptOn,
      qrCode: qrInfo.data
    }

    // Restore Brightness
    console.log(`Restoring brightness : ${brightness}`)
    Brightness.setSystemBrightnessAsync(brightness);

    navigation.navigation.navigate("QuickCashVerify", reqObj);
  };

  if (hasPermission === null) {
    return <ActivityIndicator />;
  }
  if (hasPermission === false) {
    return <ActivityIndicator />;
  }

  const InputScreen = () => {
    let myData = (data != null) ? data[accountIdx] : {};
    return (
      <View>
        <DataTable>
          <Pressable onPress={toggleBottomNavigationView}>
            <DataTable.Row>
              <DataTable.Cell>From</DataTable.Cell>
              <DataTable.Cell numeric>
                {myData.accountNumber}
                <Icon color='#5E76FA' type='font-feather' name='edit' size={20} />
              </DataTable.Cell>
            </DataTable.Row>


            <DataTable.Row>
              <DataTable.Cell>Balance</DataTable.Cell>
              <DataTable.Cell numeric>
                {myData.accountBalance} {myData.accountCurrency}
              </DataTable.Cell>
            </DataTable.Row>
          </Pressable>

          <DataTable.Row>
            <DataTable.Cell>Amount</DataTable.Cell>
            <DataTable.Cell numeric>
              {amount} {myData.accountCurrency}
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell style={{ justifyContent: 'center' }}>
              <Button mode="outlined" onPress={() => setAmount(20)} style={{ width: 100 }}>20</Button>
              <Button mode="outlined" onPress={() => setAmount(50)} style={{ width: 100 }}>50</Button>
              <Button mode="outlined" onPress={() => setAmount(100)} style={{ width: 100 }}>100</Button>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Receipt</DataTable.Cell>
            <DataTable.Cell numeric>
              <Switch value={isReceiptOn} onValueChange={onToggleReceipt} />
            </DataTable.Cell>
          </DataTable.Row>

        </DataTable>
        <View style={{ flexDirection: "row", marginLeft: 10, marginRight: 20, paddingHorizontal: 10 }}>
          <Text>On ATM machine, click Quick Cash button and scan the QR code</Text>
        </View>
      </View>
    )
  }

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
    
  };

  const ItemView = ({ item }) => {
    return (
      <View style={[styles.listview]}>
        <Pressable onPress={(event) => {
          setAccountIdx(item.id - 1);
          toggleBottomNavigationView();
        }}>
          <View style={[{ flexDirection: "row" }, styles.accountRow]}>
            <View style={{ flexDirection: "row" }}>
              <Icon color='blue' type='font-awesome' name='home' />
              <Text style={[{ paddingLeft: 5 }]}>
                {item.accountNumber}
              </Text></View>
            <Icon color='blue' type='font-awesome' name='chevron-right' />
          </View>
          <View style={styles.accountRow}>
            <Text >
              {item.accountDescription}
            </Text>
            <Text>
              {item.accountBalance} {item.accountCurrency}
            </Text>
          </View>
        </Pressable>
      </View>
    )
  };

  const MainScreen = () => {
    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <View style={{backgroundColor:"white"}}>
          <Text style={{ margin: 10, marginTop: 30, fontSize: 22, marginBottom:50 }}>Quick Cash</Text>
        </View>

        {/* Bar Code Scanner */}
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={visible ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFill, {marginTop:75}]}
        >
          <View style={styles.layerUpperTop} />
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerLowerBottom} />
          <View style={styles.layerBottom} >
            <View style={{ flex: 1, margin: 8, borderRadius: 5, padding: 10 }}>
              <InputScreen />
            </View>
          </View>
        </BarCodeScanner>

        {/* Bottom Sheet Content */}
        <BottomSheet
          visible={visible} onBackButtonPress={toggleBottomNavigationView} onBackdropPress={toggleBottomNavigationView}
        >
          <View style={styles.bottomNavigationView}>
            <FlatList
              data={data.filter(item => item.accountCurrency == BASE_CURRENCY)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
            />
          </View>

        </BottomSheet>
      </View>
    );
  }

  return (
    isLoading ? <ActivityIndicator /> : <MainScreen />
  );
}