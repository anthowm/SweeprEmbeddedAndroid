import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableHighlight, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';
import config from '../../Styles/config';
import { Borders } from '../../Styles/Helpers';
const { ThemeColors, FontFamily, Progress } = config;

/**
 * NotificationListItem
 */

class NotificationListItem extends Component {
  constructor(props) {
    super(props);
    this.goToNotificationDetails = this.goToNotificationDetails.bind(this);
  }

  goToNotificationDetails() {
    let navAction = NavigationActions.navigate({
      routeName: 'NotificationDetails',
      params: this.props.item
    });

    this.props.navigation.dispatch(navAction);
  }

  render() {
    const assets =
      this.props.item.type === 'Incident'
        ? { uri: require('../../../images/alert.png') }
        : { uri: require('../../../images/info.png') };

    return (
      <TouchableHighlight
        onPress={this.goToNotificationDetails}
        underlayColor={ThemeColors.spatial.containerBG}>
        <View style={[styles.listItemWrapper, Borders.top]}>
          <View style={styles.itemIconWrapper}>
            <Image style={styles.senderIcon} source={assets.uri} />
          </View>
          <View style={styles.itemContentWrapper}>
            <View style={styles.itemTitle}>
              <Text style={styles.senderName}>{this.props.item.title}</Text>
              <Text style={styles.itemNotificationReceivedAgo}>{this.props.item.receivedAgo}</Text>
            </View>
            <View style={styles.itemMessageWrapper}>
              <View style={styles.itemMessage}>
                <Text style={styles.message} ellipsizeMode={'tail'} numberOfLines={3}>
                  {this.props.item.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  listItemWrapper: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  itemIconWrapper: {
    marginRight: 10
  },
  senderIcon: {
    width: 37,
    height: 37,
    borderRadius: 20
  },
  itemContentWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  itemTitle: {
    flexDirection: 'row'
  },
  senderName: {
    flex: 3,
    fontFamily: FontFamily.semiBold,
    fontSize: 12
  },
  itemNotificationReceivedAgo: {
    flex: 1,
    textAlign: 'right',
    fontFamily: FontFamily.regular,
    fontSize: 8,
    color: ThemeColors.text.label
  },
  itemMessageWrapper: {
    flexDirection: 'row'
  },
  itemMessage: {
    flex: 1,
    marginTop: 5
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 14
  }
});

export default NotificationListItem;
