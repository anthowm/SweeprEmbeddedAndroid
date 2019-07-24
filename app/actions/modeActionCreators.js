/**
 * Action types
 */

export const SET_MODE_REQUESTED = 'SET_MODE_REQUESTED';

/**
 * Action creators
 */

export function setMode(setting) {
  return { type: SET_MODE_REQUESTED, setting: setting };
}
