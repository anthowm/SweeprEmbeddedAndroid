import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import ContentBox from '../../components/ContentBox/ContentBox';
import DeviceAssets from '../../lib/DeviceAssets';
import _ from 'lodash';
import config from '../../Styles/config';
const { ThemeColors, FontFamily, Status } = config;

/**
 * DeviceListItem
 */

class DeviceListItem extends Component {
  static defaultProps = {
    onPress: (item) => {
      console.warn('DeviceListItem:onPress -> Missing method.', item);
    }
  };

  getDeviceImage(item) {
    if (_.isEmpty(item.cmsImageQuery)) {
      return DeviceAssets.getDeviceImage(item);
    } else {
      return {
        uri: `https://hippo.sweepr.com/site/restservices/image?domain=device&${
          item.cmsImageQuery
        }&type=thumbnail`
      };
    }
  }

  render() {
    return (
      <ContentBox style={styles.item}>
        <TouchableHighlight
          onPress={() => _.isFunction(this.props.onPress) && this.props.onPress(this.props.item)}
          underlayColor={ThemeColors.spatial.containerBG}>
          <View style={[styles.layout, styles.itemInner]}>
            <Image
              style={[styles.layoutLeft, styles.deviceImage, styles.columnContentHeight]}
              source={this.getDeviceImage(this.props.item)} />

            <View style={[styles.layoutRight, styles.columnContentHeight]}>
              <Text style={styles.deviceName}>{this.props.item.name}</Text>
              <Text style={styles.deviceStatus}>Live Now</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white'
  },
  layout: {
    flexDirection: 'row'
  },
  layoutLeft: {
    width: 60,
    justifyContent: 'center'
  },
  layoutRight: {
    paddingLeft: 15,
    justifyContent: 'center'
  },
  alignRight: {
    alignSelf: 'flex-end'
  },
  alignLeft: {
    alignSelf: 'flex-start'
  },
  deviceName: {
    fontFamily: FontFamily.light,
    fontSize: 15,
    marginBottom: 4
  },
  deviceStatus: {
    fontFamily: FontFamily.light,
    fontSize: 15,
    color: Status.text.active
  },
  deviceImage: {
    alignSelf: 'flex-start',
    resizeMode: 'contain'
  },
  columnContentHeight: {
    height: 60
  }
});

export default DeviceListItem;
