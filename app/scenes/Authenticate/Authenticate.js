import React, { Component } from 'react';
import { NetInfo, View, StyleSheet, Text, AsyncStorage, ActivityIndicator } from 'react-native';
import _ from 'lodash';
import PrivateRouterContainer from '../../containers/PrivateRouterContainer';
import PublicRouterContainer from '../../containers/PublicRouterContainer';
import config from '../../Styles/config';
import { Titles } from '../../Styles/Text';
const { Status } = config;


class Authenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userChecksDone: false,

      /* connectionInfo types:
      'none' - device is offline
      'wifi' - device is online and connected via wifi, or is the iOS simulator
      'cellular' - device is connected via Edge, 3G, WiMax, or LTE
      'unknown' - error case and the network status is unknown */
      connectionInfo: { type: 'wifi', effectiveType: 'unknown' }
    };
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  handleConnectivityChange(connectionInfo) {
    this.props.networkActions.setNetworkConnection(connectionInfo);
    if (connectionInfo.type !== this.state.connectionInfo.type) {
      /* the network has changed */
       this.props.householdActions.getBSSID();
    }
    this.setState({ connectionType: connectionInfo });
  }

  componentDidMount() {

    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);

    // Has stored token?
    // -> Update store (app state) with token.
    // -> Start overlay fadeOut animation.
    // -> Update local state.
    AsyncStorage.getItem('@User:token').then((token) => {

      if (_.isEmpty(token)) {
        // In case there is no token;
        // - Clear token for Redux
        // - Resolve user checks (no more checks needed)
        this.props.actions.setNewToken(token);
        this.setState({ userChecksDone: true });
      } else {
        // In case there is a token;
        // - Set token for Redux
        // - Invoke profile call
        // - When profile is resolved, user checks will be updated
        this.props.actions.setNewToken(token);
        this.props.accountActions.getProfile();
      }
    });

    this.props.networkActions.setNetworkConnection();
    this.props.householdActions.getBSSID();
  }

  componentDidUpdate(prevProps) {
    if (this.props.profileStatus.resolved
      && prevProps.profileStatus.resolved !== this.props.profileStatus.resolved)
      this.setState({ userChecksDone: true });
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  render() {
    // Render spinner overlay
    const renderSpinnerOverlay = () => {
      return (
        <View>
          <ActivityIndicator
            animating={!this.props.profileStatus.resolved}
            style={[styles.loader, { height: 80 }]}
            size="large"
            color={Status.activity.indicator}
          />
          <Text style={[Titles.sub, { textAlign: 'center' }]}>Preparing...</Text>
        </View>
      );
    };

    const rendr = () => {
      // User -> Private router
      if (this.props.profileStatus.resolved
        && this.state.userChecksDone
        && this.props.loggedIn)
        return <PrivateRouterContainer />;

      // Guest -> Public router
      if (this.state.userChecksDone && !this.props.loggedIn)
        return <PublicRouterContainer />;

      // Still loading -> Spinner overlay
      return renderSpinnerOverlay();
    };

    return <View style={styles.container}>{rendr()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  loader: {
    marginTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 1000
  }
});

export default Authenticate;
