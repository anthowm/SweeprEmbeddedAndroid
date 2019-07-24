
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Reducers and Selectors
import { NotificationsSelector } from '../reducers/notifications';
import { ProfileSelector } from '../reducers/profile';

// ActionCreators
import * as actionCreators from '../actions/notificationsActionCreators';

// Scenes (component, component arg. when creating container)
import Notifications from '../scenes/Notifications/Notifications';

/**
  * Notifications
  */

const mapStateToProps = function(state) {
  return {
    notifications: NotificationsSelector.latestWithReceivedAgo(state.notifications, 40),
    currentHousehold: ProfileSelector.currentHousehold(state.profile)
  }
};

const mapDispatchToProps = function(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
};

const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications);

export default NotificationsContainer;
