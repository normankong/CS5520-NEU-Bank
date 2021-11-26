import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, ToastAndroid, ActivityIndicator, FlatList, Text, View, Switch, Dimensions, Alert } from 'react-native';
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { BottomSheet } from 'react-native-btr';
import { PacmanIndicator } from 'react-native-indicators';
import { DataTable, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import * as Brightness from 'expo-brightness';

import { styles } from './styles'
import apiHelper from '../../../common/apiHelper'
import neuHelper from '../../../common/neuHelper'

export default function Screen(navigation) {

  const TARGET_BRIGHTNESS = 0.8;
  const BASE_CURRENCY = "CAD";

  const user = neuHelper.getUser();
  const [hasPermission, setHasPermission] = useState(false);
  const [amount, setAmount] = useState(100);
  const [isReceiptOn, setIsReceiptOn] = useState(true);
  const [visible, setVisible] = useState(false);
  const [accountIdx, setAccountIdx] = useState({ accountNumber: '', accountCurrency: '', accountDescription: '', accountBalance: 0 });
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [brightness, setBrightness] = useState(0.2);
  const [dummy, setDummy] = useState(new Date());

  let pause = false;

  const onToggleReceipt = () => setIsReceiptOn(!isReceiptOn);

  const getEligibility = (item) => {
    return (item.accountCurrency == BASE_CURRENCY && item.icon == "money")
  }

  const getAccountSummary = async () => {
    try {
      let data = await apiHelper.getAccountSummary(user);
      data = data.filter(item => getEligibility(item));
      setData(data);
      if (data.length != 0) {
        setAccountIdx(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setDummy(new Date())
      return () => {
      };
    }, [])
  )

  useEffect(() => {
    getAccountSummary();

    // Initialize the BarCodeScanner
    (async () => {
      // const { status } = await BarCodeScanner.requestPermissionsAsync();
      const { status } = await Camera.requestCameraPermissionsAsync();
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
    navigation.navigation.navigate("ATMLocationScreen");
  }

  const handleBarCodeScanned = (qrInfo) => {
    if (pause) return;

    try {
      let qrCodeJson = JSON.parse(qrInfo.data);
      let exp = new Date(qrCodeJson.exp);
      if (exp.getTime() < (new Date()).getTime()) {
        pause = true;
        Alert.alert("System Error", "QR Code have been expired",
          [
            { text: `OK`, onPress: () => { pause = false } },
          ]
        );
        return;
      }

      // Format the object and then forward the request
      let reqObj = {
        accountNumber: accountIdx.accountNumber,
        accountCurrency: accountIdx.accountCurrency,
        accountDescription: accountIdx.accountDescription,
        amount: amount,
        isReceiptOn: isReceiptOn,
        qrCode: qrCodeJson
      }

      // Restore Brightness
      console.log(`Restoring brightness : ${brightness}`)
      Brightness.setSystemBrightnessAsync(brightness);

      console.log("ATM Request : ", reqObj)
      navigation.navigation.navigate("QuickCashVerifyScreen", reqObj);
    }
    catch (exception) {
      ToastAndroid.show('QR Code is not in correct formated', ToastAndroid.SHORT);
      return;
    }
  };

  if (hasPermission === null) {
    return <ActivityIndicator />;
  }
  if (hasPermission === false) {
    return <ActivityIndicator />;
  }

  const InputScreen = () => {
    return (
      <View>
        <DataTable>
          <Pressable onPress={toggleBottomNavigationView}>
            <DataTable.Row>
              <DataTable.Cell>From</DataTable.Cell>
              <DataTable.Cell numeric>
                {accountIdx.accountNumber} 
                <Icon color='#5E76FA' type='font-feather' name='edit' size={18} />
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Balance</DataTable.Cell>
              <DataTable.Cell numeric>
                {accountIdx.accountBalance} {accountIdx.accountCurrency}
              </DataTable.Cell>
            </DataTable.Row>
          </Pressable>

          <DataTable.Row>
            <DataTable.Cell>Amount</DataTable.Cell>
            <DataTable.Cell numeric>
              {amount} {accountIdx.accountCurrency}
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell style={styles.cashButton}>
              <Button color="blue" mode="outlined" onPress={() => setAmount(20)} style={{ width: 100 }}>20</Button>
              <Button color="blue" mode="outlined" onPress={() => setAmount(50)} style={{ width: 100 }}>50</Button>
              <Button color="blue" mode="outlined" onPress={() => setAmount(100)} style={{ width: 100 }}>100</Button>
            </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Receipt</DataTable.Cell>
            <DataTable.Cell numeric>
              <Switch value={isReceiptOn} onValueChange={onToggleReceipt} />
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>

        <View style={{ flexDirection: "row", marginLeft: 10, marginRight: 60, paddingHorizontal: 10, marginTop: 10 }}>
          <Text>On ATM machine, click Quick Cash button and scan the QR code</Text>
          <Pressable onPress={showMap}>
            {/* <Icon color='#5E76FA' type='font-feather' name='map' size={30} /> */}
            <View>
              <LottieView
                source={require("../../../assets/lottie/map.json")}
                style={styles.map_animation}
                autoPlay={true}
                loop={true}
              />
            </View>
          </Pressable>
        </View>
      </View>
    )
  }

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };

  const BottomSheetItemView = ({ item }) => {
    return (
      <View style={[styles.listview]}>
        <Pressable onPress={(event) => {
          setAccountIdx(item);
          toggleBottomNavigationView();
        }}>
          <View style={[{ flexDirection: "row" }, styles.accountRow]}>
            <View style={{ flexDirection: "row" }}>
              <Icon color='blue' type='font-awesome' name='home' />
              <Text style={[{ paddingLeft: 5 }]}>
                {item.accountNumber}
              </Text>
            </View>
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

  const isPause = () => {
    if (visible) return true;
    if (pause) return true;
    return false;
  }

  const MainScreen = () => {
    const screenWidth = Dimensions.get('window').width;
    const height = Math.round((screenWidth * 16) / 9);

    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <View style={{ backgroundColor: "white" }}>
          <Text style={{ margin: 10, marginTop: 30, fontSize: 22, marginBottom: 50 }}>Quick Cash</Text>
        </View>

        <Camera
          ratio="16:9"
          type={Camera.Constants.Type.back}
          style={[StyleSheet.absoluteFill, {
            marginTop: 75,
            height: height,
            width: "100%",
          }]}
          onBarCodeScanned={isPause() ? undefined : handleBarCodeScanned}
        >
          <View style={styles.layerUpperTop} />
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerLowerBottom} />
          <View style={styles.layerBottom} >
            <View style={{ flex: 1, margin: 5, borderRadius: 5, padding: 10, backgroundColor: 'white', marginBottom: 14 }}>
              <InputScreen />
            </View>
          </View>
        </Camera>

        {/* Bar Code Scanner */}
        {/* <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          // onBarCodeScanned={visible ? undefined : handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={[StyleSheet.absoluteFill, { marginTop: 75 }]}
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
        </BarCodeScanner> */}

        {/* Bottom Sheet Content */}
        <BottomSheet
          visible={visible} onBackButtonPress={toggleBottomNavigationView} onBackdropPress={toggleBottomNavigationView}
        >
          <View style={styles.bottomNavigationView}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={BottomSheetItemView}
            />
          </View>

        </BottomSheet>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? <PacmanIndicator color='blue' size={60} style={{ marginTop: 160 }} /> : <MainScreen />}
    </View>
  );

}