/**
 * Action types
 */

export const FETCH_FAQ_REQUESTED = 'FETCH_FAQ_REQUESTED';

/**
 * Action creators
 */

export function fetchCMScontent(params) {
  return { type: FETCH_FAQ_REQUESTED, params };
}
