/**
 * Action types
 */

export const NETWORK_STATUS_CONNECTION_REQUESTED = 'NETWORK_STATUS_CONNECTION_REQUESTED';

export function setNetworkConnection(connection) {
  return { type: NETWORK_STATUS_CONNECTION_REQUESTED, connection };
}
