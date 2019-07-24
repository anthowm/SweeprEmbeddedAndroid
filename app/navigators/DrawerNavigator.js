import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';

// Components
import LogoutItem from '../components/Navigation/Logout';
import DrawerList from '../components/Navigation/DrawerList';
import DrawerLogo from '../components/Navigation/DrawerLogo';
import ToggleNavigationLink from '../components/Navigation/ToggleNavigationLink';

// Brandig / config
import config from '../Styles/config';

// Screens
import HouseholdRegistrationContainer from '../containers/HouseholdRegistrationContainer';

// Stack navigators
import * as Stack from './StackNavigators';

import InitialRouteContainer from '../containers/InitialRouteContainer';

const { Drawer } = config;

const RouteConfig = {
  Main: {
    screen: Stack.NavMain,
    navigationOptions: {
      drawerLabel: 'Home'
    }
  },

  HouseholdStatus: {
    screen: Stack.NavHome,
    navigationOptions: {
      drawerLabel: 'Household Status'
    }
  },

  Devices: {
    screen: Stack.NavDevices
  },

  Services: {
    screen: Stack.NavServices
  },

  Notifications: {
    screen: Stack.NavNotifications
  },

  Settings: {
    screen: Stack.NavSettings,
    navigationOptions: {
      drawerLabel: 'My Profile'
    }
  }
};

const NavigatorConfig = {
  initialRouteName: 'Main',
  drawerWidth: () => Dimensions.get('window').width,
  contentComponent: (props) => {
    return (
      <View style={styles.drawerOuter}>
        <View style={styles.logo}>
          <DrawerLogo />
        </View>
        <ScrollView contentContainerStyle={styles.drawerInner}>
          <DrawerList {...props} />
          <LogoutItem onPress={props.screenProps.sessionActions.logout} />
        </ScrollView>
        <ToggleNavigationLink
          navigate={() => props.navigation.closeDrawer()}
          style={{ top: 50 }}
          size={30}
          name="chevron-thin-left"
          imageStyle={{ paddingVertical: 10 }}
        />
      </View>
    );
  }
};

const DrawerNavigator = createDrawerNavigator(RouteConfig, NavigatorConfig);

const styles = StyleSheet.create({
  logo: {
    paddingHorizontal: 25,
    alignItems: 'flex-end'
  },
  drawerOuter: {
    flex: 1,
    height: '100%',
    backgroundColor: Drawer.container
  },
  drawerInner: {
    marginTop: 20,
    paddingHorizontal: 35
  }
});

export default DrawerNavigator;
