import _ from 'lodash';
import Strings from '../lib/Strings.json';

const MockDevicesMap = {
  IPHONE8: 70,
  JIMSMACBOOKPRO: 72,
  JIMSMACBOOK: 72,
  JIMSIPHONE: 74,
  LUKESPS4: 100,
  'PS4 Den': 101,
  PS4DEN: 101,
  'RING.COMDOORBELL': 102,
  HOMEXBOX: 103,
  ALANSMACBOOK: 200,
  ALANSIPHONE: 201,
  GOOGLEHOME: 300
};

export const initialState = [];

// Lodash _.sortBy doesn't quite sort IP
// addressess properly, so we'll do it instead.
export const sortByIP = (ary) => {
  return ary.sort((a, b) => {
    a = a.ipAddress.split('.');
    b = b.ipAddress.split('.');
    for (let i = 0; i < a.length; i++) {
      if ((a[i] = parseInt(a[i])) < (b[i] = parseInt(b[i]))) return -1;
      if (a[i] > b[i]) return 1;
    }
    return 0;
  });
};

// Reducer
function devices(state = initialState, action) {
  switch (action.type) {
    case 'SCAN_DEVICES_REQUESTED':
      return state;

    case 'DEVICE_FOUND':
      let newState = state.slice(0);

      // Explained:
      // If there's already a device with this IP in the state,
      // then we update that device with data from action.
      // If this device is new (has new IP)
      // then we simple add it to state.
      if (
        _.some(newState, (device) => {
          return device.ipAddress === action.device.ipAddress;
        })
      ) {
        _.each(newState, (device) => {
          if (device.ipAddress === action.device.ipAddress) _.assign(device, action.device);
        });
      } else {
        newState.push(action.device);
      }

      // Adds ID attribute
      newState = _.map(newState, (item) => {
        return _.assign({}, item, {
          id: MockDevicesMap[item.sanitisedHostName] || item.id || _.uniqueId('id-')
        });
      });

      return sortByIP(newState);

    case 'SCAN_FOR_DEVICES_SUCCEEDED':
      return state;

    case 'SYNC_DEVICES_SUCCEEDED':
      return state;

    case 'DEVICES_SCAN_FAILED':
      return state;

    case 'DEVICES_SCAN_COMPLETED':
      return state;

    case 'DEVICE_CLEAR_LOCAL_REQUESTED':
      return initialState;

    default:
      return state;
  }
}

// Selector
export const DevicesSelector = {
  // A user can manually trigger these actions on a device.
  deviceActions: ['DISCONNECT', 'RECONNECT'],

  // Reconstructs the state completely to fit the need of our components.
  // Returns a sensibly structured object.
  all: (state) => {
    return _.map(state, (device) => {
      const name =
        device.hostName && device.hostName.length > 0 ? device.hostName : device.ipAddress;

      return {
        id: device.id,
        key: 'key-' + device.ipAddress,
        name: `${name}`,
        status: device.status,
        starred: false,
        connected: true,
        actions: [],
        origin: device,
        meta: [
          { key: 'key-lastSeen', id: 'lastSeen', value: Date.now(), label: Strings.lastSeen },
          {
            key: 'key-manufacturer',
            id: 'manufacturer',
            value: device.brand,
            label: Strings.manufacturer
          }
        ]
      };
    });
  },

  starredDevices: (state) => {
    return _.filter(DevicesSelector.all(state), 'starred');
  },

  connectedDevices: (state) => {
    return _.filter(DevicesSelector.all(state), 'connected');
  },

  disconnectedDevices: (state) => {
    return _.filter(DevicesSelector.all(state), ['connected', false]);
  }
};

export default devices;
