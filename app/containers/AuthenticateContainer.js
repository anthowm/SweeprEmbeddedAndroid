import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ActionCreators
import * as actionCreators from '../actions/sessionActionCreators';
import * as accountActionCreators from '../actions/accountActionCreators';
import * as householdActionCreators from '../actions/householdActionCreators';
import * as networkActionCreators from '../actions/networkActionCreators';

// Reducers and Selectors
import { ProfileSelector } from '../reducers/profile';
import { SessionSelector } from '../reducers/session';
import { NetworkChangeSelector } from '../reducers/networkChange';

// Scenes (component, component arg. when creating container)
import Authenticate from '../scenes/Authenticate/Authenticate';

/**
 * Auth
 */

const mapStateToProps = function(state) {
  return {
    loggedIn: SessionSelector.loggedIn(state.session),
    session: state.session,
    networkConnection: NetworkChangeSelector.getNetworkConnection(state.networkChange),
    profileStatus: ProfileSelector.profileStatus(state.profile)
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    householdActions: bindActionCreators(householdActionCreators, dispatch),
    networkActions: bindActionCreators(networkActionCreators, dispatch)
  };
};

const AuthenticateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Authenticate);

export default AuthenticateContainer;
