export const RESOLUTION_DIALOG_RESPONSE = 'RESOLUTION_DIALOG_RESPONSE';
export const RESOLUTION_RESPONSE_REQUESTED = 'RESOLUTION_RESPONSE_REQUESTED';

// response should be a boolean
export function sendModalDialogResponse(response) {
  return {
    type: RESOLUTION_DIALOG_RESPONSE_REQUESTED,
    response: response
  };
}

export function sendResolutionResponse(response) {
  return {
    type: RESOLUTION_RESPONSE_REQUESTED,
    response: response
  };
}
