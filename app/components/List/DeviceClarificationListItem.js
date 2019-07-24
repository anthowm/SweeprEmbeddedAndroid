import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import ContentBox from '../../components/ContentBox/ContentBox';
import DeviceAssets from '../../lib/DeviceAssets';
import config from '../../Styles/config';
const { ThemeColors, FontFamily, Status } = config;

/**
 * DeviceClarificationListItem
 */

class DeviceClarificationListItem extends Component {
  static defaultProps = {
    onPress: (item) => {
      console.warn('DeviceClarificationListItem:onPress -> Missing method.', item);
    }
  };

  getDeviceImage(item) {
    let sourceURI =
      'https://hippo.sweepr.com/site/restservices/image?domain=device&' +
      item.cmsImageQuery +
      '&type=thumbnail';
    return { uri: sourceURI };
  }

  render() {
    return (
      <ContentBox style={styles.item}>
        <TouchableHighlight
          onPress={() => {
            this.props.onPress(this.props.item);
          }}
          underlayColor={'transparent'}>
          <View style={[styles.layout, styles.itemInner]}>
            <Image
              style={[styles.layoutLeft, styles.deviceImage, styles.columnContentHeight]}
              source={this.getDeviceImage(this.props.item)}
            />
            <View style={[styles.layoutMid, styles.columnContentHeight]}>
              <Text style={styles.deviceName}>{this.props.item.name}</Text>
              <Text style={styles.deviceStatus}>LIVE NOW</Text>
            </View>
          </View>
        </TouchableHighlight>
      </ContentBox>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    overflow: 'visible',
    marginBottom: 20,
    backgroundColor: ThemeColors.spatial.containerBG
  },
  itemInner: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  layout: {
    flexDirection: 'row'
  },
  layoutLeft: {
    flex: 3,
    justifyContent: 'center'
  },
  layoutMid: {
    flex: 8,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  deviceName: {
    fontFamily: FontFamily.light,
    fontSize: 15,
    marginBottom: 4
  },
  deviceStatus: {
    fontFamily: FontFamily.light,
    fontSize: 12,
    color: Status.text.active
  },
  deviceImage: {
    alignSelf: 'flex-start',
    resizeMode: 'contain'
  },
  columnContentHeight: {
    height: 75
  }
});

export default DeviceClarificationListItem;
