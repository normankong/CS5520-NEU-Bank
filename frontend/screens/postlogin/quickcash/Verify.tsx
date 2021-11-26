import React, {useState, useEffect} from 'react';
import { Text, View  } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import * as LocalAuthentication from 'expo-local-authentication';

import { styles } from './styles'

export default function VerifyScreen(navigation) {

  const [fingerprints, setFingerprints] = useState(false);
  const [compatible, setCompatible] = useState(false);
  const [result, setResult] = useState('');

  let item = navigation.route.params;

  const handleProceed = async () => {
    let isSuccess = await scanFingerprint();
    if (isSuccess){
      navigation.navigation.navigate("QuickCashConfirmScreen", item);
    }

  }

  const handleCancel = () => {
    navigation.navigation.goBack();
    // const popAction = StackActions.pop(1);
    // navigation.navigation.dispatch(popAction);
  }

  const checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    console.log("checkDeviceForHardware", compatible)
    setCompatible(compatible);
  };

  const checkForFingerprints = async () => {
    let fingerprints = await LocalAuthentication.isEnrolledAsync();
    console.log("checkForFingerprints", fingerprints)
    setFingerprints(fingerprints)
  }

  const scanFingerprint = async () => {
    let result = await LocalAuthentication.authenticateAsync(
      {
        promptMessage: `Confirm withdraw CAD${item.amount} at \n\n${item.qrCode.name} ?`
      });
      console.log(result);

    return result.success;
  };

  useEffect(() => {
    (async () => {
      checkDeviceForHardware();
    })();

    (async () => {
      checkForFingerprints();
    })();

  }, []);

  const MainScreen = () => {

    return (
      <View>
        <View style={{backgroundColor:"white"}}>
          <Text style={{ margin: 10, marginTop:30,fontSize: 22 }}>Verify</Text>
        </View>
        
        <View style={{
          marginTop: 30,
          justifyContent: "center",
          alignItems: 'center'
        }}
        >
          <Text>Please verify the withdrawal instruction</Text>

          <View>
            <LottieView
              source={require("../../../assets/lottie/verify.json")}
              style={styles.animation}
              autoPlay={true}
              loop={false}
            />
          </View>

          <View style={{marginTop:10}}></View>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>From</DataTable.Cell>
                <DataTable.Cell numeric>
                  {item.accountDescription}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
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
            <Text style={{ marginTop: 120 , marginHorizontal:20}}>I acknowledge that I have read and agree to the above terms and conditions</Text>
          </View>

          <View style={{ marginTop: 20, marginHorizontal:20 }}>
            <Button mode="contained" onPress={handleProceed} uppercase={false} style={styles.ctaButton}>
              Proceed
            </Button>
            <Button mode="outlined" onPress={handleCancel} uppercase={false} style={styles.normalButton}>
              Cancel
            </Button>
          </View>
        </View>
    )
  }

  return (
    <MainScreen />
  );
}