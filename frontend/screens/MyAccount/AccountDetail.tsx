import * as React from 'react';

import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, View } from '../../components/Themed';
import { Icon } from 'react-native-elements'

import { styles } from './styles'
import apiHelper from '../../common/apiHelper';

export default function AccountDetailsScreen(navigation) {
  let item = navigation.route.params;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAccountSummary();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getAccountSummary = async () => {
    try {
      console.log(item)
      let data = await apiHelper.getAccountTransaction(item);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAccountSummary();
  }, []);

  return (
    <View style={[styles.container]}>

      <View style={[styles.accountDetail, { marginTop: 0, paddingVertical: 10, paddingLeft: 10 }]}>
        <View>
          <Icon color='blue' type='font-awesome' name='home' />
          <Text style={[styles.accountDescription]}>
            {item.accountDescription}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.accountDescription]}>
            {item.accountNumber}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: "#5E76FA" }}>
        {isLoading ? <ActivityIndicator /> : (
          <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
          />
        )}
      </View>
    </View>
  );
}

const ItemView = ({ item }) => {

  return (
    <View style={[styles.listview]}>
      <View style={[{ marginBottom: 0 }, styles.accountRow]}>
        <View style={{ flexDirection: "row" }}>
          <Icon color='blue' type='font-awesome' name={item.txnType} style={{ width: 25, marginRight: 10 }} />
          <Text style={[styles.accountDescription, { width: 200 }]}>
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
