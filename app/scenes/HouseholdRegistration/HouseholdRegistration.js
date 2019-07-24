import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground
} from "react-native";
import Button from "apsl-react-native-button";
import _ from "lodash";
import { button, buttonText } from "../../Styles/Form";
import config from "../../Styles/config";
const { ThemeColors, FontFamily } = config;

const ImageBackgroundSource = require("../../../images/home_registration.png");
const homeNetworkIcon = require("../../../images/home_network.png");

/**
 * HouseholdRegistration, will be imported and used as container component
 */

class HouseholdRegistration extends Component {
  constructor(props) {
    super(props);
    this.selectNetwork = this.selectNetwork.bind(this);
  }

  componentDidMount() {
    this.props.actions.getSSID();
    this.props.actions.getBSSID();
  }

  selectNetwork() {
    this.props.actions.registerHousehold(
      this.props.consumer.id,
      this.props.householdSSID,
      this.props.householdBSSID
    );
    this.props.navigation.navigate("Main");
  }

  render() {
    const missingSSID = _.isEmpty(this.props.householdSSID);
    const missingUUID = _.isUndefined(this.props.consumer.id);
    const haveNetwork = !missingSSID && !missingUUID;
    const text = haveNetwork
      ? "Is this the home network you\nwould like to manage?"
      : "You dont seem to be connected to a wifi network.\n Please connect and relaunch.";

    return (
      <ImageBackground
        style={styles.container}
        imageStyle={{ resizeMode: "cover" }}
        source={ImageBackgroundSource}
      >
        <View style={styles.contentWrapper}>
          <View>
            <Text style={styles.screenHeadline}>{text}</Text>
          </View>
          <View style={styles.networkBox}>
            <View>
              <View style={styles.homeNetworkIconWrapper}>
                <Image
                  source={homeNetworkIcon}
                  style={styles.homeNetworkIcon}
                />
              </View>
              <Text style={styles.networkTitle}>
                {this.props.householdSSID}
              </Text>
              <View style={styles.customButtonWrapper}>
                <Button
                  isDisabled={!haveNetwork}
                  style={[button, styles.swipeForHelp]}
                  onPress={this.selectNetwork}
                >
                  <Text style={buttonText}>Select this network</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  logoWrapper: {
    paddingTop: 0,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  container: {
    flex: 1
  },
  contentWrapper: {
    width: "100%",
    marginTop: 30
  },
  screenHeadline: {
    padding: 20,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    fontSize: 20,
    lineHeight: 28
  },
  networkBox: {
    marginHorizontal: 23,
    backgroundColor: ThemeColors.spatial.containerBG2,
    opacity: 0.8
  },
  homeNetworkIconWrapper: {
    marginTop: 58,
    marginBottom: 43,
    alignItems: "center"
  },
  homeNetworkIcon: {
    width: 124,
    height: 99
  },
  networkTitle: {
    textAlign: "center",
    fontFamily: FontFamily.semiBold,
    fontSize: 18
  },
  customButtonWrapper: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.spatial.separatorBorder2
  },
  skipRegistrationButtonWrapper: {
    flex: 1,
    justifyContent: "flex-end"
  }
});

export default HouseholdRegistration;
