import React, { useEffect, useState } from 'react';

import { FlatList, RefreshControl, Text, View } from 'react-native';
import { PacmanIndicator, } from 'react-native-indicators';
import { Icon } from 'react-native-elements'

import { styles } from './styles'
import apiHelper from '../../../common/apiHelper';
import neuHelper from '../../../common/neuHelper';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient, Stop, Defs } from 'react-native-svg'
import { BarChart, Grid } from 'react-native-svg-charts'

export default function Screen(navigation) {

  const user = neuHelper.getUser();

  const [isLoading, setLoading] = useState(true);
  const [accountTxnData, setAccountTxn] = useState([]);
  const [txnsPerDay, setTxnsPerDay] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAccountTransaction();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const arrangeTxns = (data) => {
    const getDaysArray = (startDate, endDate) => {
      let dates: String[] = []
      //to avoid modifying the original date
      const theDate = new Date(startDate)
      while (theDate < endDate) {
        dates = [...dates, (new Date(theDate)).toLocaleDateString("en-US")]
        theDate.setDate(theDate.getDate() + 1)
      }
      return dates
    }

    const today = new Date()
    const priorDate = new Date(new Date().setDate(today.getDate() - 30))
    const datesArr = getDaysArray(priorDate, today);
    const graphDates = data.map(el => ({
      date: (new Date(el.txnDate)).toLocaleDateString("en-US"),
      amount: parseInt(el.txnAmount),
    }))

    const dailySpending = {}
    datesArr.forEach(d => dailySpending[d] = 0)

    graphDates.forEach(el => {
      if (el.date in dailySpending)
        dailySpending[el.date] = dailySpending[el.date] + el.amount
    })
    const spendingArr: { date: string, amount: unknown }[] = []
    for (const [key, value] of Object.entries(dailySpending)) {
      spendingArr.push({ date: key, amount: value });
    }

    setTxnsPerDay(spendingArr)
  }

  const getAccountTransaction = async () => {
    try {
      let data = await apiHelper.getAllAccountTransaction(user);
      arrangeTxns(data)
      setAccountTxn(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    getAccountTransaction();
  }, []);

  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
        <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
        <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
      </LinearGradient>
    </Defs>
  )

  return (
    <View style={[styles.container]}>

      {/* Transaction History */}
      <View style={[styles.accountTransactionTable]}>
        {isLoading ?
          <PacmanIndicator color='white' size={60} /> :

          (accountTxnData.length == 0) ? <NoTransaction /> :
            (
              <>
                <Text style={{ paddingLeft: 8, color: "white", fontSize: 16, }}>
                  Transaction History over last 30 days.
                </Text>
                <ScrollView style={[styles.graphBg]}>
                  <BarChart
                    style={{ height: 200, paddingLeft: 40 }}
                    data={txnsPerDay.map(el => el.amount)}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{
                      strokeWidth: 2,
                      fill: 'url(#gradient)',
                    }}
                  >
                    <Grid />
                    <Gradient />
                  </BarChart>
                </ScrollView>
                <FlatList
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                  data={accountTxnData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={ItemView}
                />
              </>)

        }
      </View>
    </View>
  );
}

const NoTransaction = () => {
  return (
    <View style={{ flex: 5, backgroundColor: "white", justifyContent: "center", alignItems: "center", margin: 5, borderRadius: 3 }}>
      <Text style={{ color: "blue" }}>No Transaction for this account for last 30 days</Text>
    </View>
  )
}

const ItemView = ({ item }) => {

  return (
    <View style={[styles.listview]}>
      <View style={[styles.accountRow]}>
        <View style={{ flexDirection: "row" }}>
          <Icon color='blue' type='font-awesome' name={item.txnType} style={{ width: 25, marginRight: 10 }} />
          <Text style={[styles.accountDescription]}>
            {item.txnDate} {item.narrative}
          </Text>
        </View>
        <Text style={[styles.accountBalance]}>
          {item.txnAmount} {item.accountCurrency}
        </Text>
      </View>
    </View>
  )
};

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};