import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
// import Config from "react-native-config";
import config from '../../Styles/config';
const { Image: Img } = config;

/**
 * Icon
 * Render one of a few images as icon.
 */

class Icon extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Image style={[styles.image, this.props.imageStyle]} source={Img.menu[this.props.name]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 50,
    resizeMode: 'contain'
  }
});

export default Icon;
