import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator} from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import { Text, View } from '../../components/Themed';
import { styles } from './styles'
import apiHelper from '../../common/apiHelper';

export default function ConfirmScreen(navigation) {

  let item = navigation.route.params;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleAccountSummary = () => {
    navigation.navigation.navigate("AccountSummary");
  }

  const handleWithdrawAgain = () => {
    navigation.navigation.navigate("QuickCash");
  }

  const proceedQuickCash = async () => {
    try {
      let data = await apiHelper.proceedQuickCash(item);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    proceedQuickCash();
  }, []);

  const MainScreen = () => {

    return (

      <View>
        <View style={{ backgroundColor: "white" }}>
          <Text style={{ margin: 10, marginTop: 30, fontSize: 22 }}>Confirm</Text>
        </View>

        <View style={{
          marginTop: 30,
          justifyContent: "center",
          alignItems: 'center'
        }}
        >
          <Text>Your instruction have been accepted</Text>

          <View>
            <LottieView
              source={require("../../assets/lottie/confirm.json")}
              style={styles.animation}
              autoPlay={true}
              loop={false}
            />
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

          <Text style={{ margin: 20 }}>Please collect the cash from the ATM machine</Text>
        </View>

        <View style={{ marginTop: 100, marginHorizontal: 20 }}>
          <Button mode="contained" onPress={handleAccountSummary} uppercase={false} style={styles.ctaButton}>
            Back to Account Summary
          </Button>
          <Button mode="outlined" onPress={handleWithdrawAgain} uppercase={false} style={styles.normalButton}>
            Withdraw again
          </Button>
        </View>

      </View>
    )
  }

  return (
    isLoading ? <ActivityIndicator /> : <MainScreen />
  );
}