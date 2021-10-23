import * as React from 'react';
import { Pressable, ImageBackground, ActivityIndicator, FlatList, RefreshControl, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, View } from '../../components/Themed';
import { Icon } from 'react-native-elements'
import { RootTabScreenProps } from '../../types';
import { Banner } from 'react-native-paper';

import { styles } from './styles'
import apiHelper from '../../common/apiHelper';
import resHelper from '../../common/resHelper';

export default function AccountSummaryScreen({ navigation }: RootTabScreenProps<'AccountSummary'>) {

  const [isBannerVisible, setBannerVisible] = React.useState(true);

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
  }, []);


  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const BannerView = () => {
    return (<Banner
      visible={isBannerVisible}
      actions={[
        {
          label: 'Close',
          onPress: () => setBannerVisible(false),
        },
        {
          label: 'Quick Cash',
          onPress: () => navigation.navigate("QuickCash"),
        }
      ]}
      icon={({ size }) => (
        <Icon color='blue' type='font-awesome' name='money' />
      )}
      style={{ marginTop: 8 }}
    >
      Get your cash without any ATM card.
    </Banner>)

  }

  const ItemView = ({ item }) => {

    let showAccountDetail = (item) => {
      navigation.navigate("AccountDetail", item);
    }

    return (
      <View style={[styles.listview]}>
        <Pressable onPress={(event) => {
          showAccountDetail(item);
        }}>
          <View style={[{ flexDirection: "row" }, styles.accountRow]}>
            <View style={{ flexDirection: "row" }}>
              <Icon color='blue' type='font-awesome' name='home' />
              <Text style={[styles.accountNumber, { paddingLeft: 5 }]}>
                {item.accountNumber}
              </Text></View>
            <Icon color='blue' type='font-awesome' name='chevron-right' />
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountDescription}>
              {item.accountDescription}
            </Text>
            <Text style={[styles.accountBalance]}>
              {item.accountBalance} {item.accountCurrency}
            </Text>
          </View>
        </Pressable>
      </View>
    )
  };

  const image = { uri: resHelper.account.backgroundImage };
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}></ImageBackground>
      <BannerView />
      <View style={{ backgroundColor: "#5E76FA" }}>
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