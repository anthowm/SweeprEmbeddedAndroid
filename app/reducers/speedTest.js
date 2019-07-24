import _ from 'lodash';
import Strings from '../lib/Strings.json';

export const initialState = {
  activity: null,
  measure: null,
  result: null,
  overall: null
};

// Reducer
function speedTest(state = initialState, action) {
  let speed;

  switch (action.type) {
    case 'SPEED_TEST_REQUESTED':
      return _.assign({}, state, { activity: 'WORKING' });

    case 'SPEED_TEST_SUCCEEDED':
      return _.assign({}, state, {
        measure: action.response.rawResult,
        result: action.response.result,
        overall: action.response.overall
      });

    case 'SPEED_TEST_FAILED':
      console.warn('SPEED_TEST_FAILED', action);
      return initialState;

    case 'SPEED_TEST_COMPLETED':
      return _.assign({}, state, { activity: null });

    default:
      return state;
  }
}

// Selector
export const SpeedTestSelector = {
  statusMap: {
    SPEED_TEST_FAST: 'POSITIVE',
    SPEED_TEST_MEDIUM: 'POOR',
    SPEED_TEST_SLOW: 'NEGATIVE',
    SPEED_TEST_NO_INTERNET: 'NEGATIVE'
  },

  // Returns a more workable object that includes more reasoning than the core state.
  // - Status, a string with a normalised status (POSITIVE, POOR, NEGATIVE)
  // - Description, a string describing either current activity or a result in plain text.
  all: (state) => {
    let [description, status] = Boolean(state.activity === 'WORKING')
      ? [Strings['speed-test']['activity-label']['SPEED_TEST_REQUESTED'], null]
      : [Strings['speed-test'].result[state.overall], SpeedTestSelector.statusMap[state.overall]];
    return _.assign({}, state, { status, description });
  }
};

export default speedTest;
