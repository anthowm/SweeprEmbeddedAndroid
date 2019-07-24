export const assets = {
  macbook: {
    name: 'MacBook Pro',
    url: require('../../assets/device_images/macbookpro.png')
  },
  iphone: {
    name: 'iPhone X',
    url: require('../../assets/device_images/iphonex.png')
  },
  playstation: {
    name: 'playstation',
    url: require('../../assets/device_images/PS4.png')
  },
  xbox: {
    name: 'xbox',
    url: require('../../assets/device_images/xBox.png')
  },
  googlehome: {
    name: 'googlehome',
    url: require('../../assets/device_images/googlehome.png')
  },
  ringdoorbell: {
    name: 'ringdoorbell',
    url: require('../../assets/device_images/ringdoorbell.png')
  },
  default: {
    name: 'Default',
    url: require('../../assets/device_images/default.png')
  }
};

const DeviceAssets = {
  getDeviceImage: function(item) {
    try {
      return assets[item.origin.deviceType].url;
    } catch (e) {
      return assets.default.url;
    }
  }
};

export default DeviceAssets;
