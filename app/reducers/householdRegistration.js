import _ from 'lodash';

export const initialState = {
  SSID: null
};

// Household reducer
export const householdRegistrationReducer = function(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_SSID_SUCCEEDED':
      return _.assign({}, state, action.response);

    case 'FETCH_BSSID_SUCCEEDED':
        return _.assign({}, state, action.response);

    case 'REGISTER_HOUSEHOLD_SUCCEEDED':
      return _.assign({}, state, action.response);

    default:
      return state;
  }
};

// Household selector
export const HouseholdRegistrationSelector = {
  householdSSID: (state) => {
    return state.SSID;
  },
  householdBSSID: (state) => {
    return state.BSSID;
  },
};
