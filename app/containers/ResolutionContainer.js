
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// ActionCreators
import * as resolutionActionCreators from '../actions/resolutionActionCreators';
// Scenes (component, component arg. when creating container)
import  ResolutionClarification  from '../scenes/Resolutions/ResolutionClarification';

/**
  * ResolutionClarification
  */
const mapStateToProps = function(state) {
  return {
    narrative: state.narrative
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    resolutionActions: bindActionCreators(resolutionActionCreators, dispatch),
  }
};

const ResolutionClarificationContainer = connect(mapStateToProps, mapDispatchToProps)(ResolutionClarification);

export default ResolutionClarificationContainer;
