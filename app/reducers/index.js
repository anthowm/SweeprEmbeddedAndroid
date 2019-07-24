import { combineReducers } from 'redux';

// Reducers
import applicationReducer from './application';
import speedTest from './speedTest';
import pingTest from './pingTest';
import devices from './devices';
import services from './services';
import householdServices from './householdServices';
import notifications from './notifications';
import faqReducer from './faqReducer';
import accountSettingsReducer from './account';
import profileReducer from './profile';
import sessionReducer from './session';
import { householdRegistrationReducer } from './householdRegistration';
import modesReducer from './modes';
import incident from './incident';
import networkChangeReducer from './networkChange';


// Combine all app reducers into the state design.
const appReducers = combineReducers({
  application: applicationReducer,
  speedTest: speedTest,
  pingTest: pingTest,
  devices: devices,
  services: services,
  householdServices: householdServices,
  notifications: notifications,
  faqList: faqReducer,
  profile: profileReducer,
  accountSettings: accountSettingsReducer,
  session: sessionReducer,
  householdRegistration: householdRegistrationReducer,
  modes: modesReducer,
  incident: incident,
  networkChange: networkChangeReducer
});

/**
 * We're arranging our default export like this, instead of returning appReducers.
 * That way when we're logging out, all reducers will reset to their initial state.
 */
export default (state, action) =>
  action.type === 'LOGOUT_REQUESTED' ? appReducers(undefined, action) : appReducers(state, action);
