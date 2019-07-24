import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import SweeprIcon from '../Icon/Icon';
import config from '../../Styles/config';
const { ThemeColors, FontFamily, Menu } = config;

/**
 * Logout Component
 */

const logoutIcon = require('../../../images/icons/logout.png');

class Logout extends Component {
  render() {
    const LHSIcon = () => {
      return (
        <SweeprIcon style={styles.LHSIcon} imageStyle={{ width: 22, height: 22 }} name={'Logout'} />
      );
    };

    const labelElm = () => {
      return <Text style={[styles.label, this.props.labelStyle]}>Log Out</Text>;
    };

    return (
      <TouchableOpacity onPress={this.props.onPress} underlayColor={Menu.component.background}>
        <View style={[styles.item]}>
          {LHSIcon()}
          {labelElm()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  LHSIcon: {
    width: 26,
    height: 55,
    justifyContent: 'center'
  },
  label: {
    flex: 10,
    paddingLeft: 10,
    lineHeight: 32,
    fontSize: 24,
    fontFamily: FontFamily.light,
    color: Menu.item.text
  }
});

export default Logout;
