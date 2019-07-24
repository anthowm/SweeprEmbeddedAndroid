
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ActionCreators
import * as incidentActionCreators from '../actions/incidentsActionCreators';

// Scenes (component, component arg. when creating container)
import  IssueClarification  from '../scenes/Resolutions/IssueClarification';

/**
  * IssueClarification
  */

const mapStateToProps = function(state) {
  return {
    incident: state.incident
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    incidentActions: bindActionCreators(incidentActionCreators, dispatch),
  }
};

/** HandleIncident
  *
  */

const IssueClarificationContainer = connect(mapStateToProps, mapDispatchToProps)(IssueClarification);

export default  IssueClarificationContainer;
