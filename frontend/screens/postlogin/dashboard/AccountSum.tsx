import { Pressable, ImageBackground, FlatList, RefreshControl, Text, View, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon } from 'react-native-elements'
import { Banner } from 'react-native-paper';
import { PacmanIndicator } from 'react-native-indicators';
import LottieView from 'lottie-react-native';
import { BackHandler } from 'react-native';

import { styles } from './styles'
import apiHelper from '../../../common/apiHelper';
import resHelper from '../../../common/resHelper';
import neuHelper from '../../../common/neuHelper';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function Screen({ navigation }) {
  const user = neuHelper.getUser();
  const [isBannerVisible, setBannerVisible] = React.useState(true);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [avator, setAvator] = useState(user.photoUrl);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAccountSummary();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getAccountSummary = async () => {
    try {
      let data = await apiHelper.getAccountSummary(user);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    BackHandler.addEventListener('hardwareBackPress', () => true);

    getAccountSummary();
  }, []);

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const BannerView = () => {
    return (
      <Banner
        visible={isBannerVisible}
        style={{ marginTop: 8 }}
        icon={({ size }) => (
          <LottieView
            source={require("../../../assets/lottie/cash.json")}
            style={styles.animation}
            autoPlay={true}
            loop={true}
          />
        )}
        actions={[
          { label: 'Close', onPress: () => setBannerVisible(false) },
          { label: 'Quick Cash', onPress: () => navigation.navigation.navigate("QuickCashScreen") }
        ]}
      >Hi {user.givenName} ! Get some cash now ?
      </Banner>)
  }

  const ItemView = ({ item }) => {

    let showAccountDetail = (item) => {
      navigation.navigation.navigate("AccountTxnScreen", item);
    }

    return (
      <View style={[styles.listview]}>
        <Pressable onPress={() => { showAccountDetail(item) }}>
          <View style={[{ flexDirection: "row" }, styles.accountRow]}>
            <View style={{ flexDirection: "row" }}>
              <Icon color='blue' type='font-awesome' name={item.icon} />
              <Text style={[styles.accountNumber, { paddingLeft: 5 }]}>
                {item.accountNumber}
              </Text>
            </View>
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

  const image = { uri: resHelper.account.acctSumBackground };

  const logoff = () => {
    Alert.alert("Log off", "Are you sure?", [
      { text: "Cancel", onPress: () => console.log("user cancel logoff"), style: "cancel" },
      {
        text: "OK", onPress: () => {
          neuHelper.setUser(null);
          navigation.navigation.navigate("PreLoginScreen")
        }
      }
    ])
  }

  return (
    <View style={styles.container}>

      <ImageBackground source={image} style={styles.background_image}>
        <TouchableHighlight style={styles.avator} onPress={logoff}>
          <Image source={{ uri: avator }} style={styles.avator}/>
        </TouchableHighlight>
      </ImageBackground>

      <BannerView></BannerView>

      <View style={{ flex: 1 }}>
        {isLoading ?
          <PacmanIndicator color='white' size={60} style={{ marginTop: 160 }} /> :
          (
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