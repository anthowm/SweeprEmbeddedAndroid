import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HeaderLogo from '../components/Navigation/HeaderLogo';
import ToggleNavigationLink from '../components/Navigation/ToggleNavigationLink';
import LoginContainer from '../containers/LoginContainer';
import TermsAndConditions from '../scenes/Info/TermsAndConditions';
import config from '../Styles/config';
const { ThemeColors } = config;

/**
 * Guest Router
 * Renders the router that handles logged-out routes.
 */

const PublicRouter = createStackNavigator({
  Login: {
    screen: LoginContainer,
    navigationOptions: ({ navigation, screenProps }) => {
      return {
        header: null
      };
    }
  },
  TermsAndConditions: {
    screen: TermsAndConditions,
    navigationOptions: ({ navigation, screenProps }) => {
      return {
        title: null,
        headerLeft: (
          <ToggleNavigationLink
            name="chevron-thin-left"
            size={18}
            navigate={() => navigation.goBack()}
          />
        ),
        headerRight: <HeaderLogo />,
        headerStyle: [styles.header]
      };
    }
  }
});

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 0,
    paddingBottom: 40,
    backgroundColor: ThemeColors.spatial.containerBG,
    borderBottomWidth: 0
  }
});

export default PublicRouter;
