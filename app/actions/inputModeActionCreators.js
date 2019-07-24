/**
 * Action types
 */

export const SET_KEYBOARD_MODE_REQUESTED = 'SET_KEYBOARD_MODE_REQUESTED';

/**
 * Action creators
 */

export function setKeyboardMode(setting) {
  return { type: SET_KEYBOARD_MODE_REQUESTED, setting: setting };
}
