import _ from 'lodash';

export const initialState = {
  networkConnection: {
    type: 'unknown',
    effectiveType: 'unknown'
  }
};

// Application reducer
const networkChangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NETWORK_STATUS_CONNECTION_REQUESTED': {
      return _.assign({}, state, { networkConnection: action.connection });
    }

    default: {
      return state;
    }
  }
};

export const NetworkChangeSelector = {
  getNetworkConnection: (state) => {
    return state.networkConnection;
  },
}

export default networkChangeReducer;
