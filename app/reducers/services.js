import _ from 'lodash';
import moment from 'moment';

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
function services(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_SERVICES_REQUESTED':
      return _.assign({}, state, {
        processes: _.assign({}, state.processes, { fetchingServices: true })
      });

    case 'FETCH_SERVICES_COMPLETED':
      return _.assign({}, state, {
        processes: _.assign({}, state.processes, { fetchingServices: false })
      });

    case 'FETCH_SERVICES_SUCCEEDED':
      return _.assign({}, state, action.response);

    case 'FETCH_SERVICES_FAILED':
      console.warn('FETCH_SERVICES_FAILED', action);
      return state;

    case 'FETCH_SELECTED_SERVICE_REQUESTED':
      return _.assign({}, state, { selectedService: action.selectedService });

    default:
      return state;
  }
}

// Selector
export const ServicesSelector = {
  // Returns array of services
  all: (state) => {
    return _.map(state.content, (service) => {
      return _.assign({}, service, { key: 'key-' + service.id });
    });
  },

  // Returns state processes object
  processes: (state) => {
    return state.processes;
  },

  meta: (state) => {
    return _.pick(state, [
      'totalPages',
      'totalElements',
      'last',
      'size',
      'number',
      'sort',
      'numberOfElements',
      'first'
    ]);
  },

  connectedServices: (state) => {
    return ServicesSelector.all(state);
  },

  // Returns one selected service object
  selectedService: (state) => {
    const infoListSortingOrder = {
      name: 1,
      minimumBandwidth: 2,
      lastStatusCheck: 3,
      social: 4
    };

    const list = _.map(state.selectedService, (val, key) => {
      return { field: key, value: val, sort: infoListSortingOrder[key] };
    });

    let infoList = _.sortBy(
      _.filter(list, (obj) => {
        return _.some(['name', 'minimumBandwidth', 'social', 'lastStatusCheck'], (f) => {
          return f === obj.field;
        });
      }),
      ['sort']
    );

    // Info list, data used to render the list below the main area of a service.´
    infoList = _.map(infoList, (item) => {
      if (item.field === 'lastStatusCheck') {
        item.value = moment(item.value).fromNow();
      }
      if (item.field === 'minimumBandwidth') {
        item.value = item.value + ' Mb/s';
      }
      return _.assign(item, { key: 'key-' + item.field });
    });

    return _.assign(
      {},
      state.selectedService,
      {
        lastDownTime:
          state.selectedService && state.selectedService.lastDownTime
            ? moment(state.selectedService.lastDownTime).fromNow()
            : '-'
      },
      { infoList }
    );
  }
};

export default services;
