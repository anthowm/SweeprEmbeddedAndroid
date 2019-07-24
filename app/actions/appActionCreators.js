/**
 * Action types
 */

export const SET_APP_VERSION_REQUESTED = 'SET_APP_VERSION_REQUESTED';
export const SET_APNS_TOKEN_REQUESTED = 'SET_APNS_TOKEN_REQUESTED';
export const SET_NOTIFICATION_RECEIVED_REQUESTED = 'SET_NOTIFICATION_RECEIVED_REQUESTED';

/**
 * Action creators
 */

export function setAppVersion(version) {
  return {
    type: SET_APP_VERSION_REQUESTED,
    version
  };
}

export function resetRemoteNotification(note) {
  return {
    type: SET_NOTIFICATION_RECEIVED_REQUESTED,
    note
    };
}


export function updateAPNSToken(registerToken) {
  return {
    type: SET_APNS_TOKEN_REQUESTED,
    registerToken
  };
}
