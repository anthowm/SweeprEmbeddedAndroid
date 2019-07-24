import _ from 'lodash';

export const initialState = {
  notificationData: {},
  registerToken:"",
  version:""
}

// Application reducer
const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_APP_VERSION_REQUESTED':
      return _.assign({}, state, { version: action.version });

    case 'SET_APNS_TOKEN_REQUESTED': {
      return _.assign({}, state, { registerToken: action.registerToken });
    }

    case 'SET_NOTIFICATION_RECEIVED_REQUESTED': {
      return _.assign({}, state, { notificationData: action.notificationData });
    }
    default:
      return state;
  }
};

export const ApplicationSelector = {
  settings: (state) => {
    return {
      id: 'application-version',
      key: 'key-application-version',
      label: 'Version',
      value: state.version
    };
  }
};

export default applicationReducer;
