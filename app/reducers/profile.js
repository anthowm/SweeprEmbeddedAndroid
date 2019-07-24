import _ from "lodash";

export const initialState = {
  networkConnection: { type: undefined, effectiveType: undefined },
  consumerUser: {},
  households: [],
  permissions: [],
  profileResolved: false
};

// Profile reducer
const profileReducer = function(state = initialState, action) {
  switch (action.type) {
    case "FETCH_PROFILE_SUCCEEDED":
      return _.assign({}, state, action.profile);

    case "FETCH_PROFILE_COMPLETED":
      return _.assign({}, state, { profileResolved: true });

    case "FETCH_PROFILE_FAILED":
      console.warn("FETCH_PROFILE_FAILED:", action.message);
      return state;

    case "SET_USER_SKILL_LEVEL_REQUESTED":
      return _.assign({}, state, {
        consumer: _.assign({}, state.consumer, {
          skillLevel: action.skillLevel
        })
      });

    case "FETCH_BSSID_SUCCEEDED":
      return _.assign({}, state, action.response);

    case "FETCH_SSID_SUCCEEDED":
      return _.assign({}, state, action.response);

    case "NETWORK_STATUS_CONNECTION_REQUESTED":
      return _.assign({}, state, { networkConnection: action.connection });

    default:
      return state;
  }
};

// Profile selector
export const ProfileSelector = {
  // Declare which profile fields should be exposed to the user
  // in plain text.
  exposedProfileFields: ["fullName", "email", "connectedNetwork"],

  // Maps profile fields to a label.
  fieldLabels: [
    { field: "firstName", label: "First name" },
    { field: "lastName", label: "Last name" },
    { field: "fullName", label: "Name" },
    { field: "email", label: "E-mail" },
    { field: "phone", label: "Phone nr." },
    { field: "connectedNetwork", label: "Connected Network" }
  ],

  /** userProfileAsArray
   * @desc Get the user profile fields as an array.
   * @param {object} state ReduxState.profile
   * @returns Returns the user profile fields as an array.
   */
  userProfileAsArray: state => {
    let userProfile = [];
    const { fieldLabels } = ProfileSelector;
    const currentHousehold = ProfileSelector.currentHousehold(state);
    // Creates fullName item.
    const fullNameItem = _.assign(
      {},
      _.first(_.filter(fieldLabels, { field: "fullName" })),
      {
        value: state.consumer.firstName + " " + state.consumer.lastName,
        key: "key-fullName"
      }
    );

    // Creates fullName item.
    const connectedNetwork = _.assign(
      {},
      _.first(_.filter(fieldLabels, { field: "connectedNetwork" })),
      {
        value: (currentHousehold && currentHousehold.wifiSSID) || "Unavailable",
        key: "key-connectedNetwork"
      }
    );

    // Creates general user profile items.
    const generalProfileItems = _.map(state.consumer, (value, key) => {
      let label = _.first(_.filter(fieldLabels, { field: key }));
      label = label ? label.label : null;
      return _.assign({}, { field: key, value, label, key: "key-" + key });
    });

    userProfile.push(fullNameItem, connectedNetwork);
    return _.concat(userProfile, generalProfileItems);
  },

  /** exposedUserProfileAsArray
   * @desc Retrieve the user profile as an array, only returns exposed fields.
   *       This is a simple filter method off of userProfileAsArray.
   * @param {object} state ReduxState.profile
   * @returns {array} Returns exposed profile fields as an array.
   */
  exposedUserProfileAsArray: state => {
    const ary = ProfileSelector.userProfileAsArray(state);
    const fields = ProfileSelector.exposedProfileFields;
    return _.filter(ary, data => {
      return _.some(fields, field => {
        return field === data.field;
      });
    });
  },

  // Get basic information in object format.
  // Returns Object.
  /** basicData
   * @desc
   * @param
   * @returns
   */

  households: state => {
    return state.households || [];
  },

  hasHouseholds: state => {
    return !_.isEmpty(state.households);
  },

  currentHousehold: state => {
    const households = ProfileSelector.households(state);
    const hasHouseholds = ProfileSelector.hasHouseholds(state);
    const { type: networkConnectionType } = state.networkConnection;
    return hasHouseholds && networkConnectionType === "cellular"
      ? _.last(households)
      : _.find(state.households, { wifiSSID: state.SSID });
  },

  /** registerHousehold
   * @desc Decide weather the household registration process should begin.
   * @param {object} state ReduxState.profile
   * @returns Returns Boolean value.
   */
  registerHousehold: state => {
    const hasHouseholds = ProfileSelector.hasHouseholds(state);
    const currentHousehold = ProfileSelector.currentHousehold(state);
    return _.isEmpty(hasHouseholds) && _.isEmpty(currentHousehold);
  },

  profileStatus: state => {
    return { resolved: Boolean(state.profileResolved) };
  },

  selectedSkillLevel: state => {
    return state.consumer.skillLevel || 0;
  },

  skillLevelOptions: () => {
    return [
      {
        value: "Novice",
        code: 0
      },
      {
        value: "Intermediate",
        code: 50
      },
      {
        value: "Advanced",
        code: 100
      }
    ];
  },

  skillLevelSettings: state => {
    return [
      {
        id: "SKILL_LEVEL",
        key: "key-SKILL_LEVEL",
        label: "Level",
        value: _.find(
          ProfileSelector.skillLevelOptions(),
          option => option.code === ProfileSelector.selectedSkillLevel(state)
        ).value
      }
    ];
  }
};

export default profileReducer;
