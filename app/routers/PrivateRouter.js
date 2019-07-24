import React, { Component } from 'react';
import DrawerNavigator from '../navigators/DrawerNavigator';
import LocalDevices from '../lib/LocalDevices';

/**
 * Private Router
 * Renders the router that handles logged-in routes.
 *
 * This is the entrypoint for authenticated users, so
 * here's where we initialize household scanning services.
 */

export let Scanner;

class PrivateRouter extends Component {
  constructor(props) {
    super(props);
    Scanner = new LocalDevices({
      actions: { ...props.deviceScanActions }
    });
  }

  render() {
    return (
      <DrawerNavigator
        screenProps={{
          actions: this.props.actions,
          sessionActions: this.props.sessionActions,
          mode: this.props.mode,
          households: this.props.households,
          hasHouseholds: this.props.hasHouseholds,
          currentHousehold: this.props.currentHousehold,
          unreadNotifications: this.props.unreadNotifications
        }}
      />
    );
  }
}

export default PrivateRouter;
