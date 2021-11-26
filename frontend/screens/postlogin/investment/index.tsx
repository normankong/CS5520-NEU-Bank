import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment</Text>
      <LottieView
        source={require("../../../assets/lottie/investment.json")}
        style={styles.animation}
        autoPlay={true}
        loop={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  animation: {
    width: 150,
    height: 150,
  },
});
