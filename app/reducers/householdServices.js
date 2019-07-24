import _ from 'lodash';
import moment from 'moment';
import { ServicesSelector } from './services';

export const initialState = {
  content: [],
  selectedService: null,
  totalPages: null,
  totalElements: null,
  last: null,
  size: null,
  number: null,
  sort: null,
  numberOfElements: null,
  first: null,
  processes: {
    fetchingService: false,
    fetchingServices: false
  }
};

// Reducer
function householdServices(state = initialState, action) {
  let content;

  switch (action.type) {
    case 'FETCH_HOUSEHOLD_SERVICES_REQUESTED':
      return _.assign({}, state, {
        processes: _.assign({}, state.processes, { fetchingServices: true })
      });

    case 'FETCH_HOUSEHOLD_SERVICES_COMPLETED':
      return _.assign({}, state, {
        processes: _.assign({}, state.processes, { fetchingServices: false })
      });

    case 'FETCH_HOUSEHOLD_SERVICES_SUCCEEDED':
      content = _.map(action.response.content, service => {
        return _.assign({}, service, { added: true });
      });
      return _.assign({}, state, { content });

    case 'FETCH_HOUSEHOLD_SERVICES_FAILED':
      console.warn('FETCH_HOUSEHOLD_SERVICES_FAILED', action);
      return state;

    case 'ADD_HOUSEHOLD_SERVICE_SUCCEEDED':
      content = state.content.slice(0);
      content.unshift(_.assign({}, action.response, { added: true }));
      content = _.uniqBy(content, 'id');
      return _.assign({}, state, { content });

    // REMOVE_HOUSEHOLD_SERVICE_REQUESTED
    // Removes a service from the service list. We do this change to the local
    // state so we do not need to re-fetch the list with a request.
    case 'REMOVE_HOUSEHOLD_SERVICE_REQUESTED':
      content = _.reject(state.content.slice(0), (s) => s.id === action.serviceID);
      return _.assign({}, state, { content });

    // SCHEDULE_HOUSEHOLD_SERVICE_FOR_DELETION_REQUESTED
    // This action is fired before we fire action to delete a service.
    // This let's us run animations before performing deletions.
    case 'SCHEDULE_HOUSEHOLD_SERVICE_FOR_DELETION_REQUESTED':
      content = _.map(state.content.slice(0), (service) => {
        return service.id === action.serviceID
          ? _.assign({}, service, { scheduledForDeletion: true })
          : service;
      });

      return _.assign({}, state, { content });

    default:
      return state;
  }
}

// HouseholdServicesSelector extends the general ServicesSelector
export const HouseholdServicesSelector = _.extend({}, ServicesSelector, {});

export default householdServices;
