import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Reducers and Selectors
import { SpeedTestSelector } from '../reducers/speedTest';
import { PingTestSelector } from '../reducers/pingTest';
import { ServicesSelector } from '../reducers/services';
import { DevicesSelector } from '../reducers/devices';

// ActionCreators
import * as speedTestActionCreators from '../actions/speedTestActionCreators';
import * as pingTestActionCreators from '../actions/pingTestActionCreators';
import * as servicesActionCreators from '../actions/servicesActionCreators';
import * as deviceScanActionCreators from '../actions/devicesActionCreators';

// Scenes (component, component arg. when creating container)
import HouseholdStatus from '../scenes/Home/HouseholdStatus';

const mapStateToProps = function(state) {
  return {
    speedTest: SpeedTestSelector.all(state.speedTest),
    pingTest: PingTestSelector.all(state.pingTest),
    connectedServices: ServicesSelector.connectedServices(state.services),
    connectedDevices: DevicesSelector.connectedDevices(state.devices)
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    speedTestActions: bindActionCreators(speedTestActionCreators, dispatch),
    pingTestActions: bindActionCreators(pingTestActionCreators, dispatch),
    servicesActions: bindActionCreators(servicesActionCreators, dispatch),
    deviceScanActions: bindActionCreators(deviceScanActionCreators, dispatch)
  };
};

const HouseholdStatusContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HouseholdStatus);

export default HouseholdStatusContainer;
