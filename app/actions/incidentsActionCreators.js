/**
 * Action types
 */

// Action types for incident.
export const CREATE_INCIDENT_REQUESTED          = 'CREATE_INCIDENT_REQUESTED';
export const RESPOND_WITH_ISSUE_REQUESTED       = 'RESPOND_WITH_ISSUE_REQUESTED';
export const RESPOND_WITH_DEVICE_REQUESTED      = 'RESPOND_WITH_DEVICE_REQUESTED';
export const RESPOND_WITH_SERVICE_REQUESTED     = 'RESPOND_WITH_SERVICE_REQUESTED';
export const SUBSCRIBE_TO_INCIDENT_REQUESTED    = 'SUBSCRIBE_TO_INCIDENT_REQUESTED';
export const UNSUBSCRIBE_TO_INCIDENT_REQUESTED  = 'UNSUBSCRIBE_TO_INCIDENT_REQUESTED';
export const ACKNOWLEDGE_INCIDENT_REQUESTED     = 'ACK_INCIDENT';
export const CREATE_REMOTE_INCIDENT_REQUESTED   = 'CREATE_REMOTE_INCIDENT_REQUESTED';
export const DEVICE_CLARIFICATION_REQUEST       = 'DEVICE_CLARIFICATION_REQUEST';

export function sendDeviceResponse(deviceID, incidentID) {
  return {
    type: RESPOND_WITH_DEVICE_REQUESTED,
    deviceID: deviceID,
    incidentID: incidentID
  };
}

export function sendServiceResponse(serviceID, incidentID) {
  return {
    type: RESPOND_WITH_SERVICE_REQUESTED,
    serviceID: serviceID,
    incidentID: incidentID
  };
}

export function sendIssueResponse(issueID, incidentID) {
  return {
    type: RESPOND_WITH_ISSUE_REQUESTED,
    issueID: issueID,
    incidentID: incidentID
  };
}

export function createIncident(narrative, householdID) {
  return {
    type: CREATE_INCIDENT_REQUESTED,
    payload: { narrative, householdID }
  };
}

export function createRemoteIncident(incidentResponse) {
  return {
    type: CREATE_REMOTE_INCIDENT_REQUESTED,
    payload: { incidentResponse }
  };
}

export function subscribeToIncident(incidentID) {
  return {
    type: SUBSCRIBE_TO_INCIDENT_REQUESTED,
    incidentID: incidentID
  };
}

export function unSubscribeToIncident(incidentID) {
  return {
    type: UNSUBSCRIBE_TO_INCIDENT_REQUESTED,
    incidentID: incidentID
  };
}

export function ackknowledgeIncident(incidentID) {
  return {
    type: ACKNOWLEDGE_INCIDENT_REQUESTED,
    payload: { incidentID }
  };
}

export function deviceSuggestionInput(payload) {
  return {
    type: DEVICE_CLARIFICATION_REQUEST,
    payload
  };
}
