import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

/**
 * NotificationDetails
 */

class NotificationDetails extends Component {
  render() {
    const assets = { uri: require('../../../images/info.png') };
    let notification = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.listItemWrapper}>
          <View style={styles.itemIconWrapper}>
            <Image style={styles.senderIcon} source={assets.uri} />
          </View>
          <View style={styles.itemContentWrapper}>
            <View style={styles.itemTitle}>
              <Text style={styles.senderName}>{notification.title}</Text>
              <Text style={styles.itemNotificationReceivedAgo}>{notification.receivedAgo}</Text>
            </View>
            <View style={styles.itemMessageWrapper}>
              <View style={styles.itemMessage}>
                <Text style={styles.message} ellipsizeMode={'tail'} numberOfLines={3}>
                  {notification.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.spatial.containerBG
  },
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

export default NotificationDetails;
