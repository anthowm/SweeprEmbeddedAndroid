import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import ToggleNavigationLink from '../components/Navigation/ToggleNavigationLink';
import HeaderLogo from '../components/Navigation/HeaderLogo';

// Scenes
import DeviceDetails from '../scenes/Devices/DeviceDetails';
import DeviceWarranty from '../scenes/Devices/DeviceWarranty';
import DeviceFAQ from '../scenes/Devices/DeviceFAQ';
import FAQDetails from '../scenes/Devices/FAQDetails';
import NotificationDetails from '../scenes/Notifications/NotificationDetails';

// Containers
import InitialRouteContainer from '../containers/InitialRouteContainer';
import HouseholdRegistrationContainer from '../containers/HouseholdRegistrationContainer';
import HouseholdStatusContainer from '../containers/HouseholdStatusContainer';
import ServicesContainer from '../containers/ServicesContainer';
import ServiceDetailsContainer from '../containers/ServiceDetailsContainer';
import DevicesContainer, { HelpWithDeviceContainer } from '../containers/DevicesContainer';
import IssueClarificationContainer from '../containers/IssueClarificationContainer';
import ResolutionContainer from '../containers/ResolutionContainer';
import FAQContainer from '../containers/FAQContainer';
import NotificationsContainer from '../containers/NotificationsContainer';
import SettingsContainer from '../containers/SettingsContainer';
import NarrativeInputContainer from '../containers/NarrativeInputContainer';

// Brandig / config
import config from '../Styles/config';

const { ThemeColors } = config;

// Commonly used default navigation options
const topOptionsFn = ({ navigation }) => ({
  title: null,
  headerLeft: <ToggleNavigationLink navigate={() => navigation.openDrawer()} />,
  headerRight: <HeaderLogo />,
  headerStyle: [Header.standard]
});

const nestedOptionsFn = ({ navigation }) => ({
  title: navigation.state.params && navigation.state.params.title || null,
  headerLeft: (
    <ToggleNavigationLink name="chevron-thin-left" size={18} navigate={() => navigation.goBack()} />
  ),
  headerStyle: [Header.standard, Header.custom]
});

/**
 * Stack routers
 *
 */

export const NavNotifications = createStackNavigator({
  Notifications: {
    screen: NotificationsContainer,
    navigationOptions: topOptionsFn
  },
  NotificationDetails: {
    screen: NotificationDetails,
    navigationOptions: nestedOptionsFn
  }
});

export const NavHome = createStackNavigator({
  HouseholdStatus: {
    screen: HouseholdStatusContainer,
    navigationOptions: topOptionsFn
  }
});

export const NavDevices = createStackNavigator({
  Devices: {
    screen: DevicesContainer,
    navigationOptions: topOptionsFn
  },

  DeviceDetails: {
    screen: DeviceDetails,
    navigationOptions: nestedOptionsFn
  },

  DeviceFAQ: {
    screen: FAQContainer,
    navigationOptions: nestedOptionsFn
  },

  DeviceFAQDetails: {
    screen: FAQDetails,
    navigationOptions: nestedOptionsFn
  },

  DeviceWarranty: {
    screen: DeviceWarranty,
    navigationOptions: nestedOptionsFn
  }
});

export const NavServices = createStackNavigator({
  Services: {
    screen: ServicesContainer,
    navigationOptions: topOptionsFn
  },
  ServiceDetails: {
    screen: ServiceDetailsContainer,
    navigationOptions: nestedOptionsFn
  }
});

export const NavSettings = createStackNavigator({
  DevicSettingses: {
    screen: SettingsContainer,
    navigationOptions: topOptionsFn
  }
});

export const NavMain = createStackNavigator(
  {
    InitialRoute: {
      screen: InitialRouteContainer // Config in component.
    },

    HelpWithDevice: {
      screen: HelpWithDeviceContainer,
      navigationOptions: nestedOptionsFn
    },

    IssueClarification: {
      screen: IssueClarificationContainer,
      navigationOptions: nestedOptionsFn
    },

    ResolutionClarification: {
      screen: ResolutionContainer,
      navigationOptions: nestedOptionsFn
    }
  },
  {
    initialRouteName: 'InitialRoute'
  }
);

const Header = StyleSheet.create({
  standard: {
    paddingTop: Platform.OS === 'ios' ? 70 : 0,
    paddingBottom: 40,
    backgroundColor: ThemeColors.spatial.containerBG,
    borderBottomWidth: 0
  },
  custom: {
    backgroundColor: ThemeColors.spatial.containerBG,
    paddingTop: 0,
    paddingBottom: 0
  }
});
