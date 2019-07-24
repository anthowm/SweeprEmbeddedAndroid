import _ from 'lodash';

export const initialState = {
  loginForm: true,
  registrationError: null,
  loginError: null,
  processingRequest: false,
  token: null
};

// Reducer
function session(state = initialState, action) {
  switch (action.type) {
    /*
     * LOGIN
     */

    case 'LOGIN_REQUESTED':
      return _.assign({}, state, { processingRequest: true, loginError: null });

    case 'LOGIN_SUCCEEDED':
      return state;

    case 'LOGIN_COMPLETED':
      return _.assign({}, state, { processingRequest: false });

    case 'LOGIN_FAILED':
      return _.assign({}, state, { loginError: action.message });

    /*
     * LOGOUT
     */

    case 'LOGOUT_SUCCEEDED':
      return _.assign({}, initialState, { loginForm: true });

    case 'LOGOUT_COMPLETED':
      return _.assign({}, state, { processingRequest: false });

    case 'LOGOUT_FAILED':
      console.warn('LOGOUT_FAILED', action);
      return initialState;

    /*
     * REGISTER HOUSEHOLD USER
     */

    case 'REGISTER_HOUSEHOLD_USER_REQUESTED':
      return _.assign({}, state, { processingRequest: true, registrationError: null });

    case 'REGISTER_HOUSEHOLD_USER_COMPLETED':
      return _.assign({}, state, { processingRequest: false });

    case 'REGISTER_HOUSEHOLD_USER_SUCCEEDED':
      return _.assign({}, state, {
        loginForm: true,
        successfullyRegisteredEmail: action.session.email
      });

    case 'REGISTER_HOUSEHOLD_USER_FAILED':
      return _.assign({}, state, { registrationError: action.message });

    /*
     * OTHER
     */

    case 'NEW_TOKEN_RECEIVED':
      return _.assign({}, state, { token: action.token });

    case 'TOGGLE_LOGIN_FORM':
      return _.assign({}, state, { loginForm: !state.loginForm });

    default:
      return state;
  }
}

export const SessionSelector = {
  loggedIn: (state) => {
    return Boolean(state.token);
  },

  focusLoginForm: (state) => {
    return state.loginForm;
  },

  focusRegistrationForm: (state) => {
    return !state.loginForm;
  }
};

export default session;
