import React, { useEffect, useState } from 'react';

import { ImageBackground, FlatList, RefreshControl, Text, View } from 'react-native';
import { PacmanIndicator, } from 'react-native-indicators';
import { Icon } from 'react-native-elements'

import { styles } from './styles'
import apiHelper from '../../../common/apiHelper';
import resHelper from '../../../common/resHelper';
import neuHelper from '../../../common/neuHelper';

export default function Screen(navigation) {

  const item = navigation.route.params;
  const user = neuHelper.getUser();

  const [isLoading, setLoading] = useState(true);
  const [accountTxnData, setAccountTxn] = useState([]);
  const [accountSumData, setAccountSum] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAccountTransaction();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getAccountTransaction = async () => {
    try {
      let data = await apiHelper.getAccountTransaction(user, item);
      setAccountTxn(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getAccountSummary = async () => {
    try {
      let data = await apiHelper.getAccountSummary(user);
      let tmp = data.filter(x => x.accountNumber == item.accountNumber)[0];
      setAccountSum(tmp);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAccountTransaction();
    getAccountSummary();
  }, []);

  const image = { uri: resHelper.account.acctTxnBackground };

  return (
    <View style={[styles.container]}>

      {/* Account Summary */}
      <View style={[styles.accountSummarySection]}>
        <ImageBackground source={image} style={styles.accountSummaryBackground}>
          <Icon color='blue' type='font-awesome' name={accountSumData.icon} style={styles.icon} size={35} />

          <Text style={[styles.accountSummary]}>
            {item.accountNumber}
          </Text>
          <Text style={[styles.accountSummary]}>
            {accountSumData.accountCurrency} {accountSumData.accountBalance}
          </Text>
        </ImageBackground>
      </View>

      {/* Transaction History */}
      <View style={[styles.accountTransaction]}>
        {isLoading ?
          <PacmanIndicator color='white' size={60} /> :
          
            (accountTxnData.length == 0) ? <NoTransaction/> : 
            <FlatList
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              data={accountTxnData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
            />
          
        }
      </View>
    </View>
  );
}

const NoTransaction = () => {
  return (
    <View style={{flex:5, backgroundColor:"white",justifyContent: "center",alignItems: "center", margin:5, borderRadius:3}}>
      <Text style={{color:"blue"}}>No Transaction for this account for last 30 days</Text>
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
