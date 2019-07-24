import _ from 'lodash';
import Strings from '../lib/Strings.json';

export const initialState = {
  lastCreatedIncident: {},
  lastCreatedIncidentError: null
};

// Reducer
function incident(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_INCIDENT_SUCCEEDED':
      return _.assign({}, state, {
        lastCreatedIncident: action.incidentResponse,
        lastCreatedIncidentError: null
      });

    case 'CREATE_REMOTE_INCIDENT_REQUESTED':
      return _.assign({}, state, {
        lastCreatedIncident: action.payload.incidentResponse,
        lastCreatedIncidentError: null
      });

    case 'CREATE_INCIDENT_FAILED':
      return _.assign({}, state, {
        lastCreatedIncident: {},
        lastCreatedIncidentError: action.error.userInfo
      });

    default:
      return state;
  }
}

// Selector
export const IncidentSelector = {};

export default incident;
