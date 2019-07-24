
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import config from '../../Styles/config';
const { Image: Img } = config;

class DrawerLogo extends Component {
  render() { return <Image style={styles.logo} source={Img.logo.header} />; }
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 50,
    marginRight: -10,
    height: 15,
    width: 121,
    resizeMode: 'contain'
  }
});

export default DrawerLogo;
