import {
  call,
  put,
  fork,
  take,
  takeLatest,
  takeEvery,
  select
} from "redux-saga/effects";
import XHR from "../lib/XHR";
import { NativeModules } from "react-native";
import { getURL } from "../lib/API.utils";
import { API_AUTH_CONFIG } from "../lib/API.config";
import { clearAppStorage, storeAuthToken } from "../lib/Storage";
import { ModesSelector } from "../reducers/modes";
import { Scanner } from "../routers/PrivateRouter";
import { sweeprResolution } from "../scenes/Resolutions/IssueClarification";

const speedTest = NativeModules.SpeedTest;
const pingTest = NativeModules.PingTest;
const sweeprCloud = NativeModules.SweeprCloud;
const sweeprScan = NativeModules.SweeprScan;

/*
the sweeprCloud enpoints can be set with a object where
HIPPO_ENDPOINT points to the CSR endpoint
API_ENDPOINT is the api API_ENDPOINT

you can set the headers with the setHeaders method.

If you dont want to use the login of the sweeprCloud then call
sweeprCloud.setToken(token, refreshToken)

you can also set a CONFIG
sweeprCloud.setConfig(config)
and then set the mode sweeprCloud.setMode("DEMO")

The config should be of the form set in the API.config.js file

also you can set the mode and config together

sweeprCloud.setMode("DEMO", config)

*/

const API = new XHR({
  axiosDefaults: {
    headers: {
      "Content-Type": "application/json"
    },
    timeout: 1000 * 60,
    responseType: "json"
  }
});

// FACTORIES

export function withTokenCheckFactory(saga, { FAILED, COMPLETED }) {
  return function* withTokenCheck(...args) {
    try {
      yield call(saga, ...args);
    } catch (e) {
      if (e.code === "401") {
        yield put({ type: "LOGOUT_REQUESTED", message: e.message });
      } else {
        console.warn(FAILED, e.message);
        yield put({ type: FAILED, message: e.message });
      }
    } finally {
      yield put({ type: COMPLETED });
    }
  };
}

// WORKERS

function* registerHousehold(action) {
  const response = yield sweeprCloud.createNewHouseHold(
    { wifiSSID: action.householdSSID, wifiBSSID: action.householdBSSID },
    action.userID
  );
  yield put({ type: "REGISTER_HOUSEHOLD_SUCCEEDED", response });
  yield put({ type: "FETCH_PROFILE_REQUESTED" });
}

function* fetchServices(action) {
  const response = yield sweeprCloud.getAllServices(0);
  yield put({ type: "FETCH_SERVICES_SUCCEEDED", response });
}

function* fetchHouseholdServices(action) {
  let pageNumber = 0;
  const response = yield sweeprCloud.getHouseHoldServices(
    pageNumber,
    action.householdID
  );
  yield put({ type: "FETCH_HOUSEHOLD_SERVICES_SUCCEEDED", response });
}

function* addServiceToHousehold(action) {
  const response = yield sweeprCloud.addHouseHoldService(
    action.serviceID,
    action.householdID
  );
  yield put({ type: "ADD_HOUSEHOLD_SERVICE_SUCCEEDED", response });
}

function* removeServiceFromHousehold(action) {
  const response = yield sweeprCloud.deleteHouseholdService(
    action.serviceID,
    action.householdID
  );
  yield put({ type: "REMOVE_HOUSEHOLD_SERVICE_SUCCEEDED", response });
}

function* fetchSSID() {
  const response = yield sweeprScan.getSSID();
  yield put({ type: "FETCH_SSID_SUCCEEDED", response });
}

function* fetchBSSID() {
  const response = yield sweeprScan.getBSSID();
  yield put({ type: "FETCH_BSSID_SUCCEEDED", response });
}

function* fetchProfile() {
  const response = yield sweeprCloud.getUserProfile();
  yield put({ type: "FETCH_PROFILE_SUCCEEDED", profile: response });
}

function* triggerModeChangeSideEffects(action) {
  yield put({ type: "FETCH_PROFILE_REQUESTED" });
  yield put({ type: "FETCH_NOTIFICATIONS_REQUESTED" });
  yield put({ type: "SET_MODE_SUCCEEDED" });
}

function* updateUserSkillLevel(action) {
  const state = yield select(state => state);
  const { id: userID } = state.profile.consumer;
  const response = yield sweeprCloud.updateUserSkillLevel(
    { skillLevel: action.skillLevel },
    userID
  );
  yield put({ type: "UPDATE_USER_SKILL_LEVEL_SUCCEEDED", response });
}

function* scanForDevices(action) {
  const response = yield call([Scanner, "startDeviceScan"], false);
  yield put({ type: "SCAN_FOR_DEVICES_SUCCEEDED", response });
  yield put({
    type: "SYNC_DEVICES_REQUESTED",
    response,
    householdID: action.householdID
  });
}

function* syncDevices(action) {
  const houseHoldId = action.householdID;
  const response = yield sweeprCloud.syncDeviceScan(
    action.response.identifier,
    houseHoldId
  );
  yield put({ type: "SYNC_DEVICES_SUCCEEDED", response });
}

function* syncResolutionAttempt(action) {
  const houseHoldId = action.response.householdID;
  const response = yield sweeprCloud.saveResolutionCloud(
    houseHoldId,
    action.response.audit
  );
  yield put({ type: "RESOLUTION_RESPONSE_SUCCEEDED", response });
}

// TODO: refactor this, and include token check, when proper error handling exists.
// SWEEPR-761
function* createIncident(action) {
  try {
    const houseHoldID = action.payload.householdID;
    const response = yield sweeprCloud.createIncidentWithNarrative(
      houseHoldID,
      action.payload.narrative
    );
    yield put({
      type: "CREATE_INCIDENT_SUCCEEDED",
      incidentResponse: response
    });
  } catch (e) {
    yield put({ type: "CREATE_INCIDENT_FAILED", error: e });
  } finally {
    yield put({ type: "CREATE_INCIDENT_COMPLETED" });
  }
}

function* publishDeviceResponseForIncident(action) {
  const state = yield select(state => state);
  const incidentType = state.incident.lastCreatedIncident.IncidentType;

  if (incidentType === "IncidentTypeDiagnostic") {
    const response = yield sweeprResolution.publishDeviceDiagnosticResponseForIncident(
      action.incidentID,
      action.deviceID
    );
    yield put({
      type: "RESPOND_WITH_DEVICE_REQUESTED_SUCCEEDED",
      response: response
    });
  } else {
    const response = yield sweeprResolution.publishDeviceResponseForIncident(
      action.incidentID,
      action.deviceID
    );
    yield put({
      type: "RESPOND_WITH_DEVICE_REQUESTED_SUCCEEDED",
      response: response
    });
  }
}

function* publishDeviceSuggestedResponseForIncident(action) {
  const state = yield select(state => state);
  const incidentType = state.incident.lastCreatedIncident.IncidentType;

  const { incidentID, itemID, deviceSuggested } = action.payload;

  if (incidentType === "IncidentTypeDiagnostic") {
    const response = yield sweeprResolution.publishDeviceDiagnosticSuggestedResponseForIncident(
      incidentID,
      itemID,
      deviceSuggested
    );
    yield put({ type: "DEVICE_CLARIFICATION_SUCCEEDED", response });
  } else {
    const response = yield sweeprResolution.publishDeviceSuggestedResponseForIncident(
      incidentID,
      itemID,
      deviceSuggested
    );
    yield put({ type: "DEVICE_CLARIFICATION_SUCCEEDED", response });
  }
}

function* unSubscribeToIncident(action) {
  const response = yield sweeprResolution.unsubcribeToIncidentWithIncidentID(
    action.incidentID
  );
  yield put({ type: "UNSUBSCRIBE_TO_INCIDENT_SUCCEEDED", response: response });
}

function* publishServiceResponseForIncident(action) {
  const state = yield select(state => state);
  const incidentType = state.incident.lastCreatedIncident.IncidentType;

  if (incidentType === "IncidentTypeDiagnostic") {
    const response = yield sweeprResolution.publishServiceDiagnosticResponseForIncident(
      action.incidentID,
      action.serviceID
    );
    yield put({ type: "RESPOND_WITH_SERVICE_SUCCEEDED", response: response });
  } else {
    const response = yield sweeprResolution.publishServiceResponseForIncident(
      action.incidentID,
      action.serviceID
    );
    yield put({ type: "RESPOND_WITH_SERVICE_SUCCEEDED", response: response });
  }
}

function* publishIssueResponseForIncident(action) {
  const response = yield sweeprResolution.publishIssueResponseForIncident(
    action.incidentID,
    action.issueID
  );
  yield put({ type: "RESPOND_WITH_ISSUE_SUCCEEDED", response: response });
}

function* updateAPNSToken(action) {
  const state = yield select(state => state);
  const { id: userID } = state.profile.consumer;

  if (action.registerToken != undefined && userID != undefined) {
    const response = yield sweeprCloud.updateAPNSToken(
      action.registerToken,
      userID
    );
    yield put({ type: "SET_APNS_TOKEN_SUCCEEDED", response });
  }
}

function* acknowledgeRemoteIncident(action) {
  const resolutionResponse = yield sweeprResolution.subscribeToResolutionIncident(
    action.payload.incidentResponse.id
  );

  this.setTimeout(() => {
    const ackResponse = sweeprResolution.publishAcknowledForResolution(
      action.payload.incidentResponse.id
    );
  }, 1000);

  yield put({
    type: "RESOLUTION_SUBSCRIBE_SUCCEEDED",
    ackResponse: ackResponse
  });
}

function* acknowledgeIncident(action) {
  // yield put({ type: 'ACK_INCIDENT_SUCCEEDED', ackResponse:response });
  if (action.incidentResponse.IncidentType === "IncidentTypeDiagnostic") {
    const incidentResponse = yield sweeprResolution.subscribeToDiagnosticIncident(
      action.incidentResponse.id
    );
    const resolutionResponse = yield sweeprResolution.subscribeToResolutionIncident(
      action.incidentResponse.id
    );
  } else {
    // this is a standard resolution type,  or a handover type
    const incidentResponse = yield sweeprResolution.subscribeToIncidentID(
      action.incidentResponse.id
    );
    const resolutionResponse = yield sweeprResolution.subscribeToResolutionIncident(
      action.incidentResponse.id
    );
  }

  this.setTimeout(() => {
    if (action.incidentResponse.IncidentType === "IncidentTypeDiagnostic") {
      const diagnosticAckResponse = sweeprResolution.publishDiagnosticAcknowledForIncident(
        action.incidentResponse.id
      );
      put({
        type: "DIAGNOSTIC_INCIDENT_SUBSCRIBE_SUCCEEDED",
        ackResponse: diagnosticAckResponse
      });
    } else {
      const ackResponse = sweeprResolution.publishAcknowledForIncident(
        action.incidentResponse.id
      );
      put({ type: "INCIDENT_SUBSCRIBE_SUCCEEDED", ackResponse: ackResponse });
    }
  }, 250);
}

function* fetchCMScontent(action) {
  const response = yield sweeprCloud.getFaqForNamedDevice(action.params.query);
  yield put({ type: "FETCH_FAQ_SUCCEEDED", deviceFAQList: response });
}

function* fetchNotifications(action) {
  const response = yield sweeprCloud.getNotifications(action.householdId);
  yield put({ type: "FETCH_NOTIFICATIONS_SUCCEEDED", notifications: response });
}

function* getPingResult(action) {
  const response = yield pingTest.pingWithHostName("www.apple.com", 5);
  yield put({ type: "PING_TEST_SUCCEEDED", response: response[0] });
}

// TODO: we have to wait for both the ping and speed test here /Eoin
function* syncSpeedTest(action) {
  const houseHoldId = action.householdID;
  const speed = action.response.rawResult;
  const scan = { speed, latency: 30 };
  const response = yield sweeprCloud.syncScanForHouseHold(houseHoldId, scan);
  yield put({ type: "SPEED_SCAN_SUCCEEDED", response: response[0] });
}

function* fetchSpeedTest(action) {
  const response = yield speedTest.startSpeedTest();
  yield put({
    type: "SPEED_TEST_SUCCEEDED",
    response: response[0],
    householdID: action.householdID
  });
}

function* fetchDetailedSpeedTest(action) {
  const response = yield speedTest.startSpeedTestWithTimeout(10);
  yield put({ type: "SPEED_TEST_SUCCEEDED", response: response[0] });
}

function* fetchGenericSpeedTest(action) {
  const response = yield speedTest.startSpeedTestWithURL(action.URL, 10);
  yield put({ type: "SPEED_TEST_SUCCEEDED", response: response[0] });
}

function* registerHouseholdUser(action) {
  try {
    const response = yield sweeprCloud.registerCredentials(action.data);
    yield put({ type: "REGISTER_HOUSEHOLD_USER_SUCCEEDED", session: response });
  } catch (e) {
    yield put({ type: "REGISTER_HOUSEHOLD_USER_FAILED", message: e.message });
  } finally {
    yield put({ type: "REGISTER_HOUSEHOLD_USER_COMPLETED" });
  }
}

function* login(action) {
  try {
    const response = yield sweeprCloud.loginWithCredentials(action.credentials);
    API.axiosInstance.defaults.headers.common["SWEEPR-TOKEN"] = response.token;
    storeAuthToken(response.token);
    yield put({ type: "NEW_TOKEN_RECEIVED", token: response.token });
    yield put({ type: "LOGIN_SUCCEEDED", session: response });
    yield put({ type: "FETCH_PROFILE_REQUESTED" });
  } catch (e) {
    yield put({ type: "LOGIN_FAILED", message: e.message });
  } finally {
    yield put({ type: "LOGIN_COMPLETED" });
  }
}

function* logout(action) {
  try {
    yield call(clearAppStorage);
    yield put({ type: "NEW_TOKEN_RECEIVED", token: null });
    yield put({ type: "LOGOUT_SUCCEEDED" });
    yield sweeprCloud.clearAppStorage;
  } catch (e) {
    yield put({ type: "LOGOUT_FAILED" });
  } finally {
    yield put({ type: "LOGOUT_COMPLETED" });
  }
}

// WATCHERS

function* coreSaga() {
  // Profile
  yield takeLatest(
    "FETCH_PROFILE_REQUESTED",
    withTokenCheckFactory(fetchProfile, {
      FAILED: "FETCH_PROFILE_FAILED",
      COMPLETED: "FETCH_PROFILE_COMPLETED"
    })
  );
  yield takeLatest(
    "FETCH_SSID_REQUESTED",
    withTokenCheckFactory(fetchSSID, {
      FAILED: "FETCH_SSID_FAILED",
      COMPLETED: "FETCH_SSID_COMPLETED"
    })
  );

  yield takeLatest(
    "FETCH_BSSID_REQUESTED",
    withTokenCheckFactory(fetchBSSID, {
      FAILED: "FETCH_BSSID_FAILED",
      COMPLETED: "FETCH_BSSID_COMPLETED"
    })
  );

  // Household
  yield takeLatest(
    "REGISTER_HOUSEHOLD_REQUESTED",
    withTokenCheckFactory(registerHousehold, {
      FAILED: "REGISTER_HOUSEHOLD_FAILED",
      COMPLETED: "REGISTER_HOUSEHOLD_COMPLETED"
    })
  );

  // Account settings
  yield takeLatest(
    "SET_MODE_REQUESTED",
    withTokenCheckFactory(triggerModeChangeSideEffects, {
      FAILED: "SET_MODE_FAILED",
      COMPLETED: "SET_MODE_COMPLETED"
    })
  );
  yield takeLatest(
    "UPDATE_USER_SKILL_LEVEL_REQUESTED",
    withTokenCheckFactory(updateUserSkillLevel, {
      FAILED: "UPDATE_USER_SKILL_LEVEL_FAILED",
      COMPLETED: "UPDATE_USER_SKILL_LEVEL_COMPLETED"
    })
  );

  // Devices
  yield takeLatest(
    "SCAN_FOR_DEVICES_REQUESTED",
    withTokenCheckFactory(scanForDevices, {
      FAILED: "FETCH_DEVICES_FAILED",
      COMPLETED: "FETCH_DEVICES_COMPLETED"
    })
  );
  yield takeEvery(
    "SYNC_DEVICES_REQUESTED",
    withTokenCheckFactory(syncDevices, {
      FAILED: "SYNC_DEVICES_FAILED",
      COMPLETED: "SYNC_DEVICES_COMPLETED"
    })
  );
  yield takeLatest(
    "FETCH_FAQ_REQUESTED",
    withTokenCheckFactory(fetchCMScontent, {
      FAILED: "FETCH_FAQ_FAILED",
      COMPLETED: "FETCH_FAQ_COMPLETED"
    })
  );
  yield takeEvery(
    "RESOLUTION_RESPONSE_REQUESTED",
    withTokenCheckFactory(syncResolutionAttempt, {
      FAILED: "RESOLUTION_RESPONSE_FAILED",
      COMPLETED: "RESOLUTION_RESPONSE_COMPLETED"
    })
  );

  // Notifications
  yield takeLatest(
    "FETCH_NOTIFICATIONS_REQUESTED",
    withTokenCheckFactory(fetchNotifications, {
      FAILED: "FETCH_NOTIFICATIONS_FAILED",
      COMPLETED: "FETCH_NOTIFICATIONS_COMPLETED"
    })
  );

  // Speed test
  yield takeLatest(
    "SPEED_TEST_REQUESTED",
    withTokenCheckFactory(fetchSpeedTest, {
      FAILED: "SPEED_TEST_FAILED",
      COMPLETED: "SPEED_TEST_COMPLETED"
    })
  );
  yield takeLatest(
    "SPEED_TEST_DETAILED_REQUESTED",
    withTokenCheckFactory(fetchDetailedSpeedTest, {
      FAILED: "SPEED_TEST_FAILED",
      COMPLETED: "SPEED_TEST_COMPLETED"
    })
  );
  yield takeLatest(
    "SPEED_TEST_WITH_URL_REQUESTED",
    withTokenCheckFactory(fetchGenericSpeedTest, {
      FAILED: "SPEED_TEST_FAILED",
      COMPLETED: "SPEED_TEST_COMPLETED"
    })
  );
  yield takeLatest(
    "SPEED_TEST_SUCCEEDED",
    withTokenCheckFactory(syncSpeedTest, {
      FAILED: "SPEED_SCAN_FAILED",
      COMPLETED: "SPEED_SCAN_COMPLETED"
    })
  );

  // Ping test
  yield takeLatest(
    "PING_TEST_REQUESTED",
    withTokenCheckFactory(getPingResult, {
      FAILED: "PING_TEST_FAILED",
      COMPLETED: "PING_TEST_COMPLETED"
    })
  );

  // Household
  yield takeLatest(
    "FETCH_SERVICES_REQUESTED",
    withTokenCheckFactory(fetchServices, {
      FAILED: "FETCH_SERVICES_FAILED",
      COMPLETED: "FETCH_SERVICES_COMPLETED"
    })
  );
  yield takeLatest(
    "FETCH_HOUSEHOLD_SERVICES_REQUESTED",
    withTokenCheckFactory(fetchHouseholdServices, {
      FAILED: "FETCH_HOUSEHOLD_SERVICES_FAILED",
      COMPLETED: "FETCH_HOUSEHOLD_SERVICES_COMPLETED"
    })
  );
  yield takeLatest(
    "ADD_HOUSEHOLD_SERVICE_REQUESTED",
    withTokenCheckFactory(addServiceToHousehold, {
      FAILED: "ADD_HOUSEHOLD_SERVICE_FAILED",
      COMPLETED: "ADD_HOUSEHOLD_SERVICE_COMPLETED"
    })
  );
  yield takeLatest(
    "REMOVE_HOUSEHOLD_SERVICE_REQUESTED",
    withTokenCheckFactory(removeServiceFromHousehold, {
      FAILED: "REMOVE_HOUSEHOLD_SERVICE_FAILED",
      COMPLETED: "REMOVE_HOUSEHOLD_SERVICE_COMPLETED"
    })
  );
  yield takeLatest(
    "CREATE_INCIDENT_SUCCEEDED",
    withTokenCheckFactory(acknowledgeIncident, {
      FAILED: "ACK_INCIDENT_FAILED",
      COMPLETED: "ACK_INCIDENT_COMPLETED"
    })
  );

  yield takeLatest(
    "CREATE_REMOTE_INCIDENT_REQUESTED",
    withTokenCheckFactory(acknowledgeRemoteIncident, {
      FAILED: "ACK_INCIDENT_FAILED",
      COMPLETED: "ACK_INCIDENT_COMPLETED"
    })
  );

  yield takeLatest(
    "SET_APNS_TOKEN_REQUESTED",
    withTokenCheckFactory(updateAPNSToken, {
      FAILED: "SET_APNS_TOKEN_FAILED",
      COMPLETED: "SET_APNS_TOKEN_COMPLETED"
    })
  );

  // Incidents
  yield takeLatest("CREATE_INCIDENT_REQUESTED", createIncident);
  yield takeLatest(
    "RESPOND_WITH_DEVICE_REQUESTED",
    withTokenCheckFactory(publishDeviceResponseForIncident, {
      FAILED: "RESPOND_WITH_DEVICE_REQUESTED_FAILED",
      COMPLETED: "RESPOND_WITH_DEVICE_REQUESTED_COMPLETED"
    })
  );
  yield takeLatest(
    "DEVICE_CLARIFICATION_REQUEST",
    withTokenCheckFactory(publishDeviceSuggestedResponseForIncident, {
      FAILED: "DEVICE_CLARIFICATION_FAILED",
      COMPLETED: "DEVICE_CLARIFICATION_COMPLETED"
    })
  );
  yield takeLatest(
    "RESPOND_WITH_ISSUE_REQUESTED",
    withTokenCheckFactory(publishIssueResponseForIncident, {
      FAILED: "RESPOND_WITH_ISSUE_FAILED",
      COMPLETED: "RESPOND_WITH_ISSUE_COMPLETED"
    })
  );
  yield takeLatest(
    "RESPOND_WITH_SERVICE_REQUESTED",
    withTokenCheckFactory(publishServiceResponseForIncident, {
      FAILED: "RESPOND_WITH_ISSUE_FAILED",
      COMPLETED: "RESPOND_WITH_ISSUE_COMPLETED"
    })
  );
  yield takeLatest(
    "UNSUBSCRIBE_TO_INCIDENT_REQUESTED",
    withTokenCheckFactory(unSubscribeToIncident, {
      FAILED: "UNSUBSCRIBE_TO_INCIDENT_FAILED",
      COMPLETED: "UNSUBSCRIBE_TO_INCIDENT_COMPLETED"
    })
  );

  // Authentification
  yield takeLatest("LOGIN_REQUESTED", login);
  yield takeLatest("LOGOUT_REQUESTED", logout);
  yield takeLatest("REGISTER_HOUSEHOLD_USER_REQUESTED", registerHouseholdUser);
}

function* mainSaga() {
  yield* coreSaga();
}

export default mainSaga;
