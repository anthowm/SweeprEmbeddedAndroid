
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Reducers and Selectors
import { ServicesSelector } from '../reducers/services';
import { HouseholdServicesSelector } from '../reducers/householdServices';
import { ProfileSelector } from '../reducers/profile';

// ActionCreators
import * as servicesActionCreators from '../actions/servicesActionCreators';

// Scenes (component, component arg. when creating container)
import Services from '../scenes/Services/Services';

/**
  * Services
  */

const mapStateToProps = function(state) {
  return {

    // General services
    services: ServicesSelector.all(state.services),
    servicesMeta: ServicesSelector.meta(state.services),
    serviceProcesses: ServicesSelector.processes(state.services),

    // Household services
    householdServices: HouseholdServicesSelector.all(state.householdServices),
    householdServicesMeta: HouseholdServicesSelector.meta(state.householdServices),
    householdServiceProcesses: HouseholdServicesSelector.processes(state.householdServices),

    // Household
    currentHousehold: ProfileSelector.currentHousehold(state.profile)
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    servicesActions: bindActionCreators(servicesActionCreators, dispatch)
  };
};

const ServicesContainer = connect(mapStateToProps, mapDispatchToProps)(Services);
export default ServicesContainer;
