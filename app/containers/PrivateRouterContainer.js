import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Components (in this case, a router)
import PrivateRouter from '../routers/PrivateRouter';

// Selectors who are strangely needed here
import { NotificationsSelector } from '../reducers/notifications';
import { ProfileSelector } from '../reducers/profile';
import { ModesSelector } from '../reducers/modes';

// ActionCreators
import * as accountActionCreators from '../actions/accountActionCreators';
import * as sessionActionCreators from '../actions/sessionActionCreators';
import * as deviceScanActionCreators from '../actions/devicesActionCreators';

const mapStateToProps = function(state) {
  return {
    mode: ModesSelector.modeState(state.modes),
    unreadNotifications: NotificationsSelector.unreadNotificationsCount(state.notifications),
    currentHousehold: ProfileSelector.currentHousehold(state.profile),
    households: ProfileSelector.households(state.profile),
    hasHouseholds: ProfileSelector.hasHouseholds(state.profile)
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators(accountActionCreators, dispatch),
    sessionActions: bindActionCreators(sessionActionCreators, dispatch),
    deviceScanActions: bindActionCreators(deviceScanActionCreators, dispatch)
  };
};

const PrivateRouterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateRouter);

export default PrivateRouterContainer;
