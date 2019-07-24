import _ from 'lodash';
import { AsyncStorage } from 'react-native';
// import Zeroconf from 'react-native-zeroconf';

const LocalServices = {
  _zc: null,

  initialize: () => {
    // if(!LocalServices._zc) LocalServices._zc = new Zeroconf();
  },

  setup: () => {
    LocalServices.initialize();
    // LocalServices._zc.on('start', () => console.log('The scan has started.'));
    // LocalServices._zc.on('stop', () => console.log('The scan has stopped.'));
    // LocalServices._zc.on('found', () => console.log('Something found!'));
    // LocalServices._zc.on('resolved', (serviceObj) => console.log('Resolved:', serviceObj));
  },

  scan: () => {
    // LocalServices._zc.scan(type = 'http', protocol = 'tcp', domain = 'local.');
    LocalServices._zc.scan();
  },

  stopLocalServices: () => {
    LocalServices._zc.stop();
  },

  kill: () => {
    LocalServices._zc.removeDeviceListeners();
    console.log('ZeroConf object ready to be destroyed.');
  },

  // Takes a data model that we receive from ZeroConf after a scan
  // then restructures that data to a model that is supported by
  // the API for devices. We can then use that data to sync devices
  // between the client and the server.
  normalize: (model) => {
    console.log('normalize:', model);
    return {
      lastSeen: Date.now(),
      device: {
        name: model.name,
        starred: true
      }
    };
  }
};

export default LocalServices;
