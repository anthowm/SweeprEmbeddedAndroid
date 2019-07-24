import React, { Component } from 'react';
import { View, WebView, Text, StyleSheet } from 'react-native';

/**
  * Warranty
  */

class DeviceWarranty extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.navigation.state.params
  }

  render() {
    return (
      <WebView
        source={{uri: 'https://api.sweepr.xyz/warranty.html?query={this.state.params.origin.deviceType}'}}
        style={{paddingTop: 20}}
      />
    )
  }
}

const styles = StyleSheet.create({});

export default DeviceWarranty;
