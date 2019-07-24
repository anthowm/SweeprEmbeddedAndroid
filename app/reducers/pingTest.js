import _ from 'lodash';
import Strings from '../lib/Strings.json';

export const initialState = {
  activity: null,
  measure: null,
  result: null,
  overall: null
};

// Reducer
function pingTest(state = initialState, action) {
  switch (action.type) {
    case 'PING_TEST_REQUESTED':
      return _.assign({}, state, { activity: 'WORKING' });

    case 'PING_TEST_SUCCEEDED':
      return _.assign({}, state, {
        measure: action.response.rawresult,
        result: action.response.result,
        overall: action.response.thresholdResult
      });

    case 'PING_TEST_FAILED':
      console.warn('PING_TEST_FAILED', action);
      return initialState;

    case 'PING_TEST_COMPLETED':
      return _.assign({}, state, { activity: null });

    default:
      return state;
  }
}

// Selector
export const PingTestSelector = {
  statusMap: {
    PING_TEST_FAST: 'POSITIVE',
    PING_TEST_MEDIUM: 'POOR',
    PING_TEST_SLOW: 'NEGATIVE',
    PING_TEST_NO_INTERNET: 'NEGATIVE'
  },

  all: (state) => {
    let [description, status] = Boolean(state.activity === 'WORKING')
      ? [Strings['ping-test']['activity-label']['PING_TEST_REQUESTED'], null]
      : [state.result, PingTestSelector.statusMap[state.overall]];
    return _.assign({}, state, { status, description });
  }
};

export default pingTest;
