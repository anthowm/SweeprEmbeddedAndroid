import React, { Component } from 'react';
import { Text, StyleSheet, View, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import _ from 'lodash';
import SweeprIcon from '../Icon/Icon';
import config from '../../Styles/config';
const { FontFamily, Menu, Buttons } = config;

class DrawerList extends Component {
  constructor(props) {
    super(props);
    this.isActive = this.isActive.bind(this);
  }

  static defaultProps = {
    activeTintColor: Menu.item.text,
    inactiveTintColor: Menu.item.text,
    activeBackgroundColor: 'transparent',
    inactiveBackgroundColor: 'transparent'
  };

  isActive(route) {
    return this.props.activeItemKey === route.key;
  }

  render() {
    const renderNavigationItem = (items) => {
      const { hasHouseholds, currentHousehold } = this.props.screenProps;

      // Filter menu items.
      // Should render one set of items if the user has a household
      // and another set, if the user does not have a household.
      items = _.filter(items, (item) => {
        return hasHouseholds && currentHousehold ? true : _.includes(['Settings', 'Main'], item.routeName);
      });

      return _.map(items, (route) => {
        const focused = this.props.activeItemKey === route.key;
        const label = this.props.getLabel({ route });

        const LHSIcon = () => (
          <SweeprIcon
            style={styles.LHSIcon}
            imageStyle={{ width: 22, height: 22 }}
            name={route.routeName}
          />
        );

        const unreadCount = () => {
          if (this.props.screenProps.unreadNotifications < 1) return null;
          return (
            <View style={[styles.previewBubble, styles.RHSIcon]}>
              <Text style={styles.previewBubbleText}>
                {this.props.screenProps.unreadNotifications}
              </Text>
            </View>
          );
        };

        const labelElm = () => <Text style={[styles.label, this.props.labelStyle]}>{label}</Text>;

        return (
          <TouchableOpacity
            key={route.key}
            underlayColor={Menu.component.background}
            onPress={() => {
              if (focused) this.props.navigation.closeDrawer();
              this.props.onItemPress({ route, focused });
            }}>
            <SafeAreaView style={[styles.item]}>
              {LHSIcon()}
              {typeof label === 'string' ? labelElm() : label}
              {route.routeName === 'Notifications' ? unreadCount() : null}
            </SafeAreaView>
          </TouchableOpacity>
        );
      });
    };

    return (
      <View style={[styles.container, this.props.style]}>
        {renderNavigationItem(this.props.items)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    width: '100%'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  LHSIcon: {
    width: 26,
    height: 55,
    justifyContent: 'center'
  },
  label: {
    flex: 10,
    paddingLeft: 10,
    lineHeight: 32,
    fontSize: 24,
    fontFamily: FontFamily.light,
    color: Menu.item.text
  },

  previewBubble: {
    width: 20,
    height: 20,
    backgroundColor: Buttons.primary.bg,
    overflow: 'hidden',
    borderRadius: 10
  },
  previewBubbleText: {
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: 'bold',
    fontSize: 12,
    color: Menu.item.text
  }
});

export default DrawerList;
