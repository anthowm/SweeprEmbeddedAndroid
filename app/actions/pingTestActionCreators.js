/**
 * Action types
 */

export const PING_TEST_REQUESTED = 'PING_TEST_REQUESTED';
export const PING_TEST_SUCCEEDED = 'PING_TEST_SUCCEEDED';

/**
 * Action creators
 */

export function requestPingTest() {
  return { type: PING_TEST_REQUESTED };
}

export function pingTestReturned(response = 'PING_TEST_FAILED') {
  return { type: PING_TEST_SUCCEEDED, response: response };
}
