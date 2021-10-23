import { DataTable, Button } from 'react-native-paper';
import { Text, View } from '../../components/Themed';
import React, {useState, useEffect} from 'react';
import { styles } from './styles'
import * as LocalAuthentication from 'expo-local-authentication';

export default function VerifyScreen(navigation) {

  const [fingerprints, setFingerprints] = useState(false);
  const [compatible, setCompatible] = useState(false);
  const [result, setResult] = useState('');

  let item = navigation.route.params;

  const handleProceed = async () => {

    let isSuccess = await scanFingerprint();
    if (isSuccess){
      navigation.navigation.navigate("QuickCashConfirm", item);
    }

  }

  const handleCancel = () => {
    navigation.navigation.goBack();
  }

  const checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    console.log(compatible)
    setCompatible(compatible);
  };

  const checkForFingerprints = async () => {
    let fingerprints = await LocalAuthentication.isEnrolledAsync();
    console.log(fingerprints)
    setFingerprints(fingerprints)
  }

  const scanFingerprint = async () => {
    let result = await LocalAuthentication.authenticateAsync(
      {
        promptMessage: `Verify fingerprint to withdraw cash at \n\n${JSON.parse(item.qrCode).name}`
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
                  {JSON.parse(item.qrCode).name}
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
            <Text style={{ marginTop: 280 , marginHorizontal:20}}>I acknowledge that i have read and agree to the above terms and conditions</Text>
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