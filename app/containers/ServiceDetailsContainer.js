
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Reducers and Selectors
import { ServicesSelector } from '../reducers/services';

// ActionCreators
import * as servicesActionCreators from '../actions/servicesActionCreators';

// Scenes (component, component arg. when creating container)
import ServiceDetails from '../scenes/Services/ServiceDetails';

/**
  * Services
  */

const mapStateToProps = function(state) {
  return {
    service: ServicesSelector.selectedService(state.services)
  };
};

const mapDispatchToProps = function(dispatch) {
  return {};
};

const ServiceDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(ServiceDetails);
export default ServiceDetailsContainer;
