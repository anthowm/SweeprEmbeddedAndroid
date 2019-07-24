import React, { Component, Fragment } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Paragraphs } from '../../Styles/Text';
import config from '../../Styles/config';

const { FontFamily, Image: Img } = config;

class ActiveNetwork extends Component {

  render() {
    const { wifiSSID } = this.props.currentHousehold;
    const { type: networkConnectionType } = this.props.networkConnection;

    // const noAvailableNetwork = ['none', 'unknown'].includes(networkConnectionType);
    const mobileData = networkConnectionType === 'cellular';
    // const isConnected = wifiSSID && !noAvailableNetwork;

    const homeIcon = <Image style={styles.homeIcon} source={Img.networkBar.homeIcon} />;
    const errorIcon = <Image style={styles.errorIcon} source={Img.networkBar.errorIcon}/>;

    return (
      <View style={styles.container}>
        <View style={styles.network}>
          {wifiSSID ? homeIcon : errorIcon}
          <Text style={[Paragraphs.standard, Paragraphs.placeholder]}>
            {wifiSSID || 'No network'}
          </Text>
        </View>
        {
          mobileData &&
          <Text style={[Paragraphs.standard, Paragraphs.placeholder]}>
            (Not connected)
          </Text>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  network: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  homeIcon: {
    width: 16,
    height: 17,
    marginRight: 10
  },
  errorIcon: {
    width: 16,
    height: 16,
    marginRight: 10
  }
});

export default ActiveNetwork;
