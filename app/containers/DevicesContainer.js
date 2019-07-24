import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Reducers and Selectors
import { SpeedTestSelector } from '../reducers/speedTest';
import { PingTestSelector } from '../reducers/pingTest';
import { FAQSelector } from '../reducers/faqReducer';
import { DevicesSelector } from '../reducers/devices';
import { ProfileSelector } from '../reducers/profile';

// ActionCreators
import * as deviceActionCreators from '../actions/devicesActionCreators';
import * as speedActionCreators from '../actions/speedTestActionCreators';
import * as pingActionCreators from '../actions/pingTestActionCreators';

// Scenes (component, component arg. when creating container)
import Devices from '../scenes/Devices/Devices';
import { HelpWithDevice } from '../scenes/Help/Help';

/**
  * Devices
  */

const mapStateToProps = function(state) {
  return {
    selectedSkillLevel: ProfileSelector.selectedSkillLevel(state.profile),
    speedTest: SpeedTestSelector.all(state.speedTest),
    pingTest: PingTestSelector.all(state.pingTest),
    connected: DevicesSelector.connectedDevices(state.devices),
    faq: FAQSelector.all(state.faqList),
    incident: state.incident
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    deviceActions: bindActionCreators(deviceActionCreators, dispatch),
    speedTestActions: bindActionCreators(speedActionCreators, dispatch),
    pingTestActions: bindActionCreators(pingActionCreators, dispatch)
  }
};

const DevicesContainer = connect(mapStateToProps, mapDispatchToProps)(Devices);
export default DevicesContainer;

/** HelpWithDevice
  *
  */

export const HelpWithDeviceContainer = connect(mapStateToProps, mapDispatchToProps)(HelpWithDevice);
