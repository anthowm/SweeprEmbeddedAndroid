import React, { Component } from 'react';
import { AppRegistry, Alert } from 'react-native';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';

import mainSaga from './app/sagas/sagas';
import appReducers from './app/reducers';
import AuthenticateContainer from './app/containers/AuthenticateContainer';


/**
 * Saga middleware
 */


/**
 * Application store
 */

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(appReducers, applyMiddleware(sagaMiddleware));

// Run saga
  sagaMiddleware.run(mainSaga);

export default class App extends Component {
  constructor(props) {
    super(props);

    if (props.isEmbedded === true) {
      console.disableYellowBox = true
    }
    store.dispatch({ type: 'IS_EMBEDDED_APP', isEmbedded: props.isEmbedded});
  }

  componentWillMount() {
    // Dispatching directly to store (not via action creators) since we have no
    // action creators set up at this stage. Corresponding action is: setAppVersion()
    // TODO: need to fix this after logout->login as well.
    store.dispatch({ type: 'SET_APP_VERSION_REQUESTED', version: this.props.version });
  }

  onPushNotificationRegister(token) {
    store.dispatch({ type: 'SET_APNS_TOKEN_REQUESTED', registerToken: token.token,});
    // this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onPushNotification(notif) {
    store.dispatch({ type: 'SET_NOTIFICATION_RECEIVED_REQUESTED', notificationData: notif.data});
  }

  render() {
    return (
      <Provider store={store}>
        <AuthenticateContainer />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('App', () => App);
