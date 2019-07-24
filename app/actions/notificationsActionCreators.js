/**
 * Action types
 */

export const FETCH_NOTIFICATIONS_REQUESTED = 'FETCH_NOTIFICATIONS_REQUESTED';

/**
 * Action creators
 */

export function fetchNotifications(householdId) {
  return { type: FETCH_NOTIFICATIONS_REQUESTED, householdId };
}
