import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, Image, TouchableHighlight } from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import DeviceAssets from '../../lib/DeviceAssets';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

/**
 * DeviceDetails
 */

const faqIcon = require('../../../images/icons/faq_icon.png');

class DeviceDetails extends Component {
  constructor(props) {
    super(props);

    this.onPressWarranty = this.onPressWarranty.bind(this);
    this.onPressFAQ = this.onPressFAQ.bind(this);
  }

  onPressWarranty(item) {
    this.props.navigation.navigate('DeviceWarranty', item);
  }

  onPressFAQ(item) {
    this.props.navigation.navigate('DeviceFAQ', item);
  }

  getDeviceImage(item) {
    return DeviceAssets.getDeviceImage(item);
  }

  render() {
    const { params } = this.props.navigation.state;
    const { selectedSkillLevel } = params;
    const advancedView = selectedSkillLevel > 50;
    const { name } = params.item;
    const { ipAddress } = params.item.origin;
    let { manufacturer, deviceType } = params.item.origin;
    let warranty = deviceType === 'unknown' || !deviceType ? 'None' : 'Ends - 12/12/2021'
    manufacturer = ((manufacturer === '-' || !manufacturer) && 'Unknown') || manufacturer;
    deviceType = _.upperFirst(deviceType) || 'Unknown';

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.field, styles.deviceStatusField]}>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
              <Image source={this.getDeviceImage(this.props.navigation.state.params.item)} />
            </View>
            <Text style={[styles.fieldTitle, styles.deviceStatusTitle]}>Device Status</Text>
            <Text style={styles.fieldValue}>Connected</Text>
          </View>

          <View style={[styles.field, styles.bgGray]}>
            <Text style={styles.fieldTitle}>Device Name</Text>
            <Text style={styles.fieldValue}>{name}</Text>
          </View>

          <View style={[styles.field, styles.bgGray]}>
            <Text style={styles.fieldTitle}>Manufacturer</Text>
            <Text style={styles.fieldValue}>{manufacturer}</Text>
          </View>

          <View style={[styles.field, styles.bgGray]}>
            <Text style={styles.fieldTitle}>Device Type</Text>
            <Text style={styles.fieldValue}>{deviceType}</Text>
          </View>

          {advancedView && <View style={[styles.field, styles.bgGray]}>
            <Text style={styles.fieldTitle}>IP Address</Text>
            <Text style={styles.fieldValue}>{ipAddress}</Text>
          </View>}

          {advancedView && <View style={[styles.field, styles.bgGray]}>
            <Text style={styles.fieldTitle}>MAC Address</Text>
            <Text style={styles.fieldValue}>Unknown</Text>
          </View>}

          <TouchableHighlight
            onPress={() => this.onPressWarranty(this.props.navigation.state)}
            underlayColor="transparent">
            <View style={[styles.field, styles.warrantyField, styles.bgGray]}>
              <View>
                <Text style={styles.fieldTitle}>Warranty</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={[styles.fieldValue, styles.warrantyText]}>{warranty}</Text>
                <Icon
                  style={[styles.alignRight, styles.warrantyIcon]}
                  size={24}
                  color={ThemeColors.text.primary}
                  name={'chevron-thin-right'}/>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.onPressFAQ(this.props.navigation.state)}
            underlayColor='transparent'>
            <View style={[styles.field, styles.bgGray, styles.flexRow, styles.borderField, styles.faqRow]}>
              <Feather
                style={{marginRight: 5}}
                size={18}
                color={ThemeColors.text.primary}
                name={'alert-triangle'} />
              <Text style={[styles.fieldTitle, styles.FAQtext]}>FAQ</Text>
              <Icon
                style={styles.alignRight}
                size={24}
                color={ThemeColors.text.primary}
                name={'chevron-thin-right'} />
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    marginTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  container: {
    backgroundColor: ThemeColors.spatial.containerBG
  },
  bgGray: {
    backgroundColor: ThemeColors.spatial.containerBG2
  },
  field: {
    paddingVertical: 5,
    paddingHorizontal: 25
  },
  flexRow: {
    flexDirection: 'row'
  },
  fieldTitle: {
    fontFamily: FontFamily.light,
    fontSize: 12,
    paddingVertical: 5
  },
  deviceStatusField: {
    marginBottom: 10
  },
  deviceStatusTitle: {
    fontFamily: FontFamily.light,
    fontSize: 12
  },
  fieldValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18
  },
  warrantyField: {
    paddingBottom: 15
  },
  warrantyIcon: {
    flex: 1
  },
  warrantyText: {
    flex: 13
  },
  borderField: {
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: ThemeColors.spatial.separatorBorder2,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  faqRow: {
    flex: 1,
    alignItems: 'center'
  },
  FAQicon: {
    marginRight: 10
  },
  FAQtext: {
    fontFamily: FontFamily.regular,
    fontSize: 18,
    flex: 9,
    paddingTop: 4
  },
  alignRight: {
    alignItems: 'flex-end'
  }
});

export default DeviceDetails;
