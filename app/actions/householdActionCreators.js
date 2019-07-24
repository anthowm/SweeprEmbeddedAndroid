/**
 * Action types
 */

export const REGISTER_HOUSEHOLD_REQUESTED = 'REGISTER_HOUSEHOLD_REQUESTED';
export const REGISTER_HOUSEHOLD_SUCCEEDED = 'REGISTER_HOUSEHOLD_SUCCEEDED';
export const FETCH_SSID_REQUESTED = 'FETCH_SSID_REQUESTED';
export const FETCH_BSSID_REQUESTED = 'FETCH_BSSID_REQUESTED';

/**
 * Action creators
 */

export function registerHousehold(userID, householdSSID, householdBSSID) {
  return { type: REGISTER_HOUSEHOLD_REQUESTED, userID, householdSSID, householdBSSID};
}

export function getSSID() {
  return { type: FETCH_SSID_REQUESTED };
}

export function getBSSID() {
  return { type: FETCH_BSSID_REQUESTED };
}
