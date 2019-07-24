/**
 * Action types
 */

// Action types for scan.
export const SCAN_FOR_DEVICES_REQUESTED = 'SCAN_FOR_DEVICES_REQUESTED';
export const DEVICES_SCAN_FAILED = 'DEVICES_SCAN_FAILED';
export const DEVICES_SCAN_COMPLETED = 'DEVICES_SCAN_COMPLETED';
export const DEVICES_SCAN_PROGRESS = 'DEVICES_SCAN_PROGRESS';
export const DEVICE_FOUND = 'DEVICE_FOUND';
export const DEVICE_CLEAR_LOCAL_REQUESTED = 'DEVICE_CLEAR_LOCAL_REQUESTED';
export const FETCH_FAQ_REQUESTED = 'FETCH_FAQ_REQUESTED';

/**
 * Action creators
 */

export function startDevicesScan(householdID) {
  return { type: SCAN_FOR_DEVICES_REQUESTED, householdID };
}

export function devicesScanProgress(newProgress) {
  return { type: DEVICES_SCAN_PROGRESS, newProgress };
}

export function deviceFound(device) {
  return { type: DEVICE_FOUND, device };
}

export function devicesScanCompleted(text) {
  return { type: DEVICES_SCAN_COMPLETED, text };
}

export function devicesScanFailed(status) {
  return { type: DEVICES_SCAN_FAILED, status };
}

export function fetchCMScontent(params) {
  return { type: FETCH_FAQ_REQUESTED, params };
}

export function clearLocalDevices() {
  return { type: DEVICE_CLEAR_LOCAL_REQUESTED };
}
