
import { ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';

import MapView, { Marker } from 'react-native-maps';
import * as ExpoLocation from 'expo-location';

import { Text, View } from '../../components/Themed';
import apiHelper from '../../common/apiHelper';
import { colorsDark } from 'react-native-elements/dist/config';

export default function ATMLocationScreen() {

  let defaultATMInfo = {
    title: "Please select a branch",
    desc: "",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfMMWLx8iGykTC7BhH3hSR5pmSCBHK4LzPpQ&usqp=CAU"
  }

  const [isLoading, setLoading] = useState(true);
  const [location, setLocation] = useState({});
  const [atmBranchData, setATMBranchData] = useState([]);
  const [atmInfo, setATMInfo] = useState(defaultATMInfo);

  useEffect(() => {
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await ExpoLocation.getCurrentPositionAsync({});
      let myLocation = {
        longitude : location.coords.longitude,
        latitude : location.coords.latitude
      }
      setLocation(myLocation);
      setLoading(false);
      
      let data = await apiHelper.getATMBranchs();
      setATMBranchData(data);
    })();
  }, []);


  const showCard = (marker, index) => {
    let info = atmBranchData[index];
    let result = {
      title: info.title,
      desc: info.desc,
      url: info.url
    }
    setATMInfo(result);
    setLocation(info.latlng);
  }

  const MainScreen = () => {
    return (<View >
      {isLoading ? <ActivityIndicator /> : (
        <View style={styles.container}>
          <MapView
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            style={styles.map}>
            {atmBranchData.map((marker, index) => (
              <Marker
                key={index} coordinate={marker.latlng}
                title={marker.title} description={marker.description}
                onPress={() => { showCard(marker, index) }}
              />
            ))}
          </MapView>
        </View>
      )}

      <Card style={{ width: 400 }}>
        <Card.Cover source={{ uri: atmInfo.url }} />
        <Card.Content>
          <Title>{atmInfo.title}</Title>
          <Paragraph>{atmInfo.desc}</Paragraph>
        </Card.Content>
      </Card>

    </View>)
  }

  return (
    <MainScreen/>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 400,
  },
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#00ff00',
    padding: 100,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
});