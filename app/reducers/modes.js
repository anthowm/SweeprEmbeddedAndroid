import _ from 'lodash';
import CONFIG from '../lib/app.config';

export const initialState = CONFIG;

// Reducer
function mode(state = initialState, action) {
  switch (action.type) {
    case 'SET_MODE_REQUESTED':
      const environment = action.setting.value ? action.setting.id : initialState.environment;
      return _.assign({}, state, { environment });

    case 'SET_MODE_COMPLETED':
      return state;

    case 'SET_MODE_FAILED':
      console.warn('SET_MODE_FAILED', action);
      return state;

    default:
      return state;
  }
}

// Selector

// TODO:
// Modes is a part of the apps appSettings. It's a concept that right now
// only involves the 'mode', however in the future this may come to expand
// to other appSettings such as 'theme' etc. So we should create some
// selector that combines all the app settings from various selectors so
// we can have a state prop that looks like this:
// { appSettings: AppSettingsSelector(state.modes, state.themes, ...) }
export const ModesSelector = {
  currentMode: (state) => {
    return state.environment;
  },

  inDemoMode: (state) => {
    return ModesSelector.currentMode(state) == 'DEMO';
  },

  inProductionMode: (state) => {
    return ModesSelector.currentMode(state) == 'PRODUCTION';
  },

  inDevelopmentMode: (state) => {
    return ModesSelector.currentMode(state) == 'DEVELOPMENT';
  },

  fieldLabels: {
    DEMO: 'Demo mode',
    PRODUCTION: 'Production mode',
    DEVELOPMENT: 'Development mode'
  },

  // Returns an object with the overall state of modes.
  modeState: (state) => {
    return {
      inProductionMode: ModesSelector.inProductionMode(state),
      inDemoMode: ModesSelector.inDemoMode(state),
      inDevelopmentMode: ModesSelector.inDevelopmentMode(state),
      currentMode: ModesSelector.currentMode(state)
    };
  },

  // Returns a data model in accord with a general 'settings' model.
  // This gives us the option to render the mode as a setting along-
  // side other settings.
  modeSettings: (state) => {
    return _.map(state, (val, key) => {
      return {
        id: key,
        value: val,
        key: 'key-' + key,
        label: ModesSelector.fieldLabels[val]
      };
    });
  },

  // Returns one setting (the demo setting).
  // Convenient for rendering.
  demoModeSetting: (state) => {
    return {
      id: 'DEMO',
      value: ModesSelector.inDemoMode(state),
      key: 'key-DEMO',
      label: ModesSelector.fieldLabels.DEMO
    };
  }
};

export default mode;
