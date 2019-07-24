
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ActionCreators
import * as inputModeActionCreators from '../actions/inputModeActionCreators';
import * as incidentActionCreators from '../actions/incidentsActionCreators';
import * as deviceActionCreators from '../actions/devicesActionCreators';
import * as appActionCreators from '../actions/appActionCreators';

// Reducers and Selectors
import { InputModesSelector } from '../reducers/inputModes';
import { application } from '../reducers/application';
import { NetworkChangeSelector } from '../reducers/networkChange';

// Scenes (component, component arg. when creating container)
import NarrativeInput from '../scenes/Help/NarrativeInput';

/**
  * NarrativeInput
  */

const mapStateToProps = function(state) {
  return {
    networkConnection: NetworkChangeSelector.getNetworkConnection(state.networkChange),
    inputModes:InputModesSelector.currentInputMode,
    incident: state.incident,
    notificationToken:state.application.registerToken,
    notificationData:state.application.notificationData
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators(inputModeActionCreators, dispatch),
    incidentActions: bindActionCreators(incidentActionCreators, dispatch),
    deviceActions: bindActionCreators(deviceActionCreators, dispatch),
    appActions:bindActionCreators(appActionCreators, dispatch)
   }
};

const NarrativeInputContainer = connect(mapStateToProps, mapDispatchToProps)(NarrativeInput);

export default  NarrativeInputContainer;
