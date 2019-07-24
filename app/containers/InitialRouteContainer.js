import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ToggleNavigationLink from '../components/Navigation/ToggleNavigationLink';
import HeaderLogo from '../components/Navigation/HeaderLogo';
import NarrativeInputContainer from './NarrativeInputContainer';
import HouseholdRegistrationContainer from './HouseholdRegistrationContainer';
import { ProfileSelector } from '../reducers/profile';

import _ from 'lodash';

// Brandig / config
import config from '../Styles/config';

const { ThemeColors } = config;

/**
 * Initial route for drawer navigator
 */

class InitialRoute extends Component {
  static navigationOptions = ({ screenProps: { hasHouseholds }, navigation }) => {
    const stl = hasHouseholds ? [Header.standard] : [Header.hollow];
    return {
      headerLeft: <ToggleNavigationLink navigate={() => navigation.openDrawer()}/>,
      headerRight: <HeaderLogo />,
      headerStyle: stl
    };
  };

  render() {
    return this.props.registerHousehold
      ? <HouseholdRegistrationContainer {...this.props} />
      : <NarrativeInputContainer {...this.props} />;
  }
}

const Header = StyleSheet.create({
  hollow: {
    backgroundColor: '#F1EEEB',
    borderBottomWidth: 0
  },
  standard: {
    paddingTop: Platform.OS === 'ios' ? 70 : 0,
    paddingBottom: 40,
    backgroundColor: ThemeColors.spatial.containerBG,
    borderBottomWidth: 0
  }
});

const mapStateToProps = (state) => ({
  registerHousehold: ProfileSelector.registerHousehold(state.profile)
});

const InitialRouteContainer = connect(mapStateToProps)(InitialRoute);

export default InitialRouteContainer;
