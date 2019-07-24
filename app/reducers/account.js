import _ from 'lodash';

// Account Settings initial state
export const initialState = [];

// Account Settings reducer
const accountSettingsReducer = function(state = initialState, action) {
  switch (action.type) {
    case 'ACCOUNT_SETTINGS_FETCH_SUCCEEDED':
      return action.settings;

    case 'ACCOUNT_SETTING_UPDATE_SUCCEEDED':
      return _.map(state, (setting) => {
        return setting.id === action.setting.id ? action.setting : setting;
      });

    default:
      return state;
  }
};

// Account Settings selector
export const AccountSettingsSelector = {
  // Get all account settings, with appended key.
  settings: (state) => {
    return _.map(state, (setting) => {
      return _.merge({}, setting, { key: 'key-' + setting.id });
    });
  }
};

export default accountSettingsReducer;
