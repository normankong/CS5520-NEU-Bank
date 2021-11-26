
import { ActivityIndicator, StyleSheet, Dimensions, View, Text, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Carousel from 'react-native-snap-carousel';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as ExpoLocation from 'expo-location';

import apiHelper from '../../../common/apiHelper';

export default function ATMLocationScreen() {

  let defaultATMInfo = {
    title: "Please select a branch",
    desc: "",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfMMWLx8iGykTC7BhH3hSR5pmSCBHK4LzPpQ&usqp=CAU"
  }

  const mapRef = useRef();
  const carRef = useRef();
  const [isLoading, setLoading] = useState(true);
  const [location, setLocation] = useState({});
  const [atmBranchData, setATMBranchData] = useState([]);
  const [atmInfo, setATMInfo] = useState(defaultATMInfo);
  let state = {
    markers: []
  }
  const setMarker = (index, marker) => {
    state.markers[index] = marker;
  }

  useEffect(() => {
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await ExpoLocation.getCurrentPositionAsync({});
      let myLocation = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      }
      setLocation(myLocation);
      setLoading(false);

      let data = await apiHelper.getATMBranchs();
      setATMBranchData(data);
    })();
  }, []);

  const renderCarouselItem = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.desc}</Text>
        <Image style={styles.cardImage} source={{ uri: item.url }} />
      </View>)
  }

  const onCarouselItemChange = (index) => {

    let location = atmBranchData[index];
    // console.log(location.desc)

    mapRef.current.animateCamera({
      center: {
        latitude: location.latlng.latitude,
        longitude: location.latlng.longitude,
      },
      heading: 0
    });

    state.markers[index].showCallout();
  }

  const onMarkerPressed = (location, index) => {
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035
    });

    carRef.current.snapToItem(index);
  }

  const MainScreen = () => {
    return (<View >
      {isLoading ? <ActivityIndicator /> : (
        <View style={styles.container}>
          <MapView
            ref={mapRef}
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
                ref={ref => setMarker(index, ref)}
                onPress={() => onMarkerPressed(marker, index)}
              >
                <Callout style={styles.plainView}>
                  <View>
                    <Text>{marker.title}</Text>
                    <Text>{marker.desc}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <Carousel
            ref={carRef}
            data={atmBranchData}
            containerCustomStyle={styles.carousel}
            renderItem={renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
            removeClippedSubviews={false}
            onSnapToItem={(index) => onCarouselItemChange(index)}
          />

        </View>
      )}
    </View>)
  }

  return (
    <MainScreen />
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
    height: Dimensions.get('window').height,
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
  plainView: {
    width: 200,
  },
  image: {
    width: 100,
    height: 100
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 48
  },
  cardContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 200,
    width: 300,
    padding: 24,
    borderRadius: 24,
    marginBottom: 30
  },
  cardImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center'
  },
  cardDesc: {
    color: 'white',
    fontSize: 12,
    alignSelf: 'center'
  }
});