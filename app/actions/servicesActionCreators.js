/**
 * Action types
 */
export const FETCH_SERVICES_REQUESTED = 'FETCH_SERVICES_REQUESTED';
export const FETCH_HOUSEHOLD_SERVICES_REQUESTED = 'FETCH_HOUSEHOLD_SERVICES_REQUESTED';
export const ADD_HOUSEHOLD_SERVICE_REQUESTED = 'ADD_HOUSEHOLD_SERVICE_REQUESTED';
export const REMOVE_HOUSEHOLD_SERVICE_REQUESTED = 'REMOVE_HOUSEHOLD_SERVICE_REQUESTED';
export const SCHEDULE_HOUSEHOLD_SERVICE_FOR_DELETION_REQUESTED =
  'SCHEDULE_HOUSEHOLD_SERVICE_FOR_DELETION_REQUESTED';
export const FETCH_SELECTED_SERVICE_REQUESTED = 'FETCH_SELECTED_SERVICE_REQUESTED';

/**
 * Action creators
 */

export function fetchServices(page) {
  return { type: FETCH_SERVICES_REQUESTED, page };
}

export function fetchHouseholdServices(householdID, page) {
  return { type: FETCH_HOUSEHOLD_SERVICES_REQUESTED, householdID, page };
}

export function addServiceToHousehold(householdID, serviceID) {
  return { type: ADD_HOUSEHOLD_SERVICE_REQUESTED, householdID, serviceID };
}

export function removeServiceFromHousehold(householdID, serviceID) {
  return { type: REMOVE_HOUSEHOLD_SERVICE_REQUESTED, householdID, serviceID };
}

export function scheduleHouseholdServiceForDeletion(serviceID) {
  return { type: SCHEDULE_HOUSEHOLD_SERVICE_FOR_DELETION_REQUESTED, serviceID };
}

export function fetchSelectedService(selectedService) {
  return { type: FETCH_SELECTED_SERVICE_REQUESTED, selectedService };
}
