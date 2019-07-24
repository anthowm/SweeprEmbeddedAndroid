/**
 * Action types
 */

export const NEW_TOKEN_RECEIVED = 'NEW_TOKEN_RECEIVED';
export const LOGIN_REQUESTED = 'LOGIN_REQUESTED';
export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
export const TOGGLE_LOGIN_FORM = 'TOGGLE_LOGIN_FORM';
export const REGISTER_HOUSEHOLD_USER_REQUESTED = 'REGISTER_HOUSEHOLD_USER_REQUESTED';

/**
 * Action creators
 */

export function logout() {
  return { type: LOGOUT_REQUESTED };
}

export function setNewToken(token = null) {
  return { type: NEW_TOKEN_RECEIVED, token: token };
}

export function login(credentials) {
  return {
    type: LOGIN_REQUESTED,
    credentials: { email: credentials.email, hashedPassword: credentials.password }
  };
}

export function toggleLoginForm() {
  return { type: TOGGLE_LOGIN_FORM };
}

export function register(data) {
  return {
    type: REGISTER_HOUSEHOLD_USER_REQUESTED,
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.surName,
      hashedPassword: data.password
    }
  };
}
