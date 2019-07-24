/**
 * Action types
 */

export const SPEED_TEST_REQUESTED = 'SPEED_TEST_REQUESTED';
export const SPEED_TEST_DETAILED_REQUESTED = 'SPEED_TEST_DETAILED_REQUESTED';
export const SPEED_TEST_WITH_URL_REQUESTED = 'SPEED_TEST_WITH_URL_REQUESTED';

/**
 * Action creators
 */

export function requestSpeedTest(householdID) {
  return { type: SPEED_TEST_REQUESTED, householdID };
}

export function requestSpeedTestWithURL(URL) {
  return { type: SPEED_TEST_WITH_URL_REQUESTED, URL };
}
