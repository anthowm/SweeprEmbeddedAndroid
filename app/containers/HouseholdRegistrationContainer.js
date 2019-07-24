import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ProfileSelector } from "../reducers/profile";

// Reducers and Selectors
import {
  householdRegistrationReducer,
  HouseholdRegistrationSelector
} from "../reducers/householdRegistration";

// ActionCreators
import * as actionCreators from "../actions/householdActionCreators";

// Scenes (component, component arg. when creating container)
import HouseholdRegistration from "../scenes/HouseholdRegistration/HouseholdRegistration";

/**
 * Household Registration
 */

const mapStateToProps = function(state) {
  return {
    consumer: state.profile.consumer,
    households: state.profile.households,
    householdSSID: HouseholdRegistrationSelector.householdSSID(
      state.householdRegistration
    ),
    householdBSSID: HouseholdRegistrationSelector.householdBSSID(
      state.householdRegistration
    )
  };
};

const mapDispatchToProps = function(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
};

const HouseholdRegistrationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HouseholdRegistration);

export default HouseholdRegistrationContainer;
