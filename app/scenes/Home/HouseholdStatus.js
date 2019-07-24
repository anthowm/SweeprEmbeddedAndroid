import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  RefreshControl,
  TouchableHighlight
} from 'react-native';
import ContentBox from '../../components/ContentBox/ContentBox';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import S from '../../lib/styles';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

const ConnectionAsset = {
  POSITIVE: require('../../components/Icon/assets/wifiGreen.png'),
  POOR: require('../../components/Icon/assets/wifiAmber.png'),
  NEGATIVE: require('../../components/Icon/assets/wifiRed.png'),
  UNKNOWN: require('../../components/Icon/assets/wifiGray.png')
};
const deviceAsset = { uri: require('../../components/Icon/assets/DevicesSmall.png') };
const speedAsset = { uri: require('../../components/Icon/assets/connectivitySpeed.png') };
const gamingAsset = { uri: require('../../components/Icon/assets/Gaming.png') };

class HomeDetails extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.pressConnectedServices = this.pressConnectedServices.bind(this);
    this.pressConnectedDevices = this.pressConnectedDevices.bind(this);
    this.goBack = this.goBack.bind(this);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    this.scan();
  }

  scan() {
    const { id: householdID } = this.props.screenProps.currentHousehold;
    this.props.speedTestActions.requestSpeedTest(householdID);
    this.props.pingTestActions.requestPingTest();
    this.props.servicesActions.fetchServices(0);
    this.props.deviceScanActions.startDevicesScan(householdID);
  }

  refresh() {
    this.setState({ refreshing: true });
    this.scan();
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  }

  pressConnectedServices() {
    this.props.navigation.navigate('Services');
  }

  pressConnectedDevices() {
    this.props.navigation.navigate('Devices');
  }

  goBack() {
    this.props.navigation.goBack(null);
  }

  render() {
    let statusIconAsset = this.props.speedTest.status
      ? ConnectionAsset[this.props.speedTest.status]
      : ConnectionAsset.UNKNOWN;

    return (
      <ScrollView
        contentContainerStyle={{ height: '100%', backgroundColor: ThemeColors.spatial.containerBG }}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
        }>
        <View style={styles.container}>
          <ContentBox style={styles.contentBox} shadow='thin'>
            <View style={[styles.section, styles.sectionSeparation]}>
              <View style={styles.statusLabelOuter}>
                <Text style={styles.statusLabel}>Home Connectivity Strength</Text>
                <Text style={styles.statusValue}>{this.props.speedTest.description}</Text>
              </View>
              <View style={styles.statusIconOuter}>
                <Image style={styles.statusIcon} source={statusIconAsset} />
              </View>
            </View>

            <View style={[styles.section, styles.sectionSeparation]}>
              <View style={styles.statusLabelOuter}>
                <Text style={styles.statusLabel}>Home Connectivity Speed</Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: S.color(this.props.speedTest.status).statusIcon }
                  ]}>
                  {this.props.speedTest.result}
                </Text>
              </View>
              <View style={styles.statusIconOuter}>
                <Image style={styles.statusIcon} source={speedAsset.uri} />
              </View>
            </View>

            <View style={[styles.section, styles.sectionSeparation]}>
              <View style={styles.statusLabelOuter}>
                <Text style={styles.statusLabel}>Gaming Speed</Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: S.color(this.props.pingTest.status).statusIcon }
                  ]}>
                  {this.props.pingTest.description}
                </Text>
              </View>
              <View style={styles.statusIconOuter}>
                <Image style={styles.statusIcon} source={gamingAsset.uri} />
              </View>
            </View>

            <TouchableHighlight onPress={this.pressConnectedDevices} underlayColor="white">
              <View style={[styles.section, styles.sectionSeparation]}>
                <View style={styles.statusLabelOuter}>
                  <Text style={styles.statusLabel}>Connected Devices</Text>
                  <Text style={styles.statusValue}>
                    {this.props.connectedDevices.length} Devices
                  </Text>
                </View>
                <View style={styles.statusIconOuter}>
                  <Image style={styles.statusIcon} source={deviceAsset.uri} />
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.pressConnectedServices} underlayColor="white">
              <View style={[styles.section, styles.sectionSeparation]}>
                <View style={styles.statusLabelOuter}>
                  <Text style={styles.statusLabel}>Connected Services</Text>
                  <Text style={styles.statusValue}>
                    {this.props.connectedServices.length} Services
                  </Text>
                </View>
                <View style={styles.statusIconOuter}>
                  {/*<Image style={styles.statusIcon} source={deviceAsset.uri} />*/}
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight style={{marginTop: 50}} onPress={this.goBack} underlayColor="white">
              <View style={styles.navigationButtonWrapper}>
                <Ionicons
                  style={[styles.navigationButton, { marginRight: 5 }]}
                  color={ThemeColors.text.featured}
                  size={24}
                  name={'ios-arrow-back'} />
                <Text style={styles.navigationButton}>Tap to return</Text>
              </View>
            </TouchableHighlight>

          </ContentBox>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16, // To render shadow of box
    paddingHorizontal: 32
  },
  contentBox: {
    padding: 16,
  },
  sectionSeparation: {
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColors.spatial.separatorBorder2,
    marginBottom: 20,
    paddingBottom: 20
  },

  // Layout
  section: {
    flexDirection: 'row'
  },
  statusLabelOuter: {
    flex: 1
  },
  statusIconOuter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 40
  },

  // Icons
  statusIcon: {},

  // Labels
  statusLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    marginBottom: 10
  },

  // Values
  statusValue: {
    fontFamily: FontFamily.semiBold,
    height: 24,
    fontSize: 18
  },
  navigationButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  navigationButton: {
    color: ThemeColors.text.featured,
    fontFamily: FontFamily.light,
    fontSize: 11
  }
});

export default HomeDetails;
