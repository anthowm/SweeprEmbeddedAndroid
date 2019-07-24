import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import config from '../../Styles/config';
const { Image: Img } = config;

class HeaderLogo extends Component {
  render() {
    return <Image style={styles.logo} source={Img.logo.header} />;
  }
}

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    width: 120,
    height: 35,
    marginRight: 10
  }
});

export default HeaderLogo;
