import React, { Component, Fragment } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomList from '../../components/List/CustomList';
import NotificationListItem from '../../components/List/NotificationListItem';
import config from '../../Styles/config';
const { ThemeColors, FontFamily, Status } = config;

/**
 * Notifications scene, will be imported and used as container component
 */

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    try {
      this.props.actions.fetchNotifications(this.props.currentHousehold.id);
    } catch (e) {
      console.warn('Could not fetch notifications for household', this.props.currentHousehold, e);
    }
  }

  refresh() {
    this.setState({ refreshing: true });
    this.props.actions.fetchNotifications(this.props.currentHousehold.id);
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  }

  getCustomListItems(item, navigation) {
    return (
      <NotificationListItem item={item.item} navigation={navigation} actions={this.props.actions} />
    );
  }

  render() {
    const activityIndicator = () => (
      <ActivityIndicator
        size='large'
        color={Status.activity.indicator}
        style={{ marginTop: 35 }}
      />
    );
    const notifications = () => (
      <Fragment>
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />}>
          <FlatList
            data={this.props.notifications}
            renderItem={item => this.getCustomListItems(item, this.props.navigation)}/>
        </ScrollView>
      </Fragment>
    );

    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.labelWrapper}>
            <Text style={styles.notificationsLabel}>Notifications</Text>
          </View>
        </View>
        {this.props.notifications.length ? notifications() : activityIndicator()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.spatial.containerBG,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  notificationsLabel: {
    fontFamily: FontFamily.semiBold,
    color: ThemeColors.text.featured,
    fontSize: 24,
    lineHeight: 26
  },
  content: {
    paddingHorizontal: 20
  }
});

export default Notifications;
