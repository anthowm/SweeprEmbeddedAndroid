import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ActionCreators
import * as actionCreators from '../actions/sessionActionCreators';

// Selectors
import { SessionSelector } from '../reducers/session';

// Scenes (component, component arg. when creating container)
import Login from '../scenes/Login/Login';

/**
 * Login
 */

const mapStateToProps = function(state) {
  return {
    loggedIn: SessionSelector.loggedIn(state.session),
    focusLoginForm: SessionSelector.focusLoginForm(state.session),
    session: state.session
  };
};

const mapDispatchToProps = function(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginContainer;
