import { NativeModules, NativeEventEmitter } from 'react-native';

const SweeprScan = NativeModules.SweeprScan;
const sweeprScanEvt = new NativeEventEmitter(NativeModules.SweeprScan);

class LocalDevices {
  constructor({ actions }) {
    this._devices = [];
    this.actions = actions;
    // this.startLanScan = this.startLanScan.bind(this);
    this.startDeviceScan = this.startDeviceScan.bind(this);

    this.addDeviceListeners();

    this.state = {
      device: null,
      progress: 0
    };
  }

  async startDeviceScan(demo = false) {
    // for param 1
    // value 1 will ping the entire netowork, value 2 is a subnet
    // value 2 will ping the subnet the device is on only
    // paramater 2 is the timeout
    // The NativeEventEmitter update the devices
    const result = await SweeprScan.startDeviceScanWithOptions(1, 20);
    return result;
  }

  startLanScan(demo = false) {
    if (demo) {
      console.info('Demo scan..');
      SweeprScan.startDemo();
    } else {
      console.info('Real scan..');
      SweeprScan.startLanScanWithOption(16);
    }
  }

  reset() {
    SweeprScan.reset();
  }

  stopLanScan() {
    SweeprScan.stopLanScan();
  }

  addDeviceListeners() {
    this.deviceName = 'Not Found';

    /*

    you can query for these names.
    const NSString *kRCTDeviceHostName = @"hostName";
    const NSString *kRCTDeviceIPAddress = @"ipAddress";
    const NSString *kRCTDevicePort = @"devicePort";
    const NSString *kRCTDeviceMacAddress = @"macAddress";
    const NSString *kRCTSubNetMask = @"subnetmask";
    const NSString *kRCTBrand = @"brand";
    const NSString *kRCTManufacturer = @"manufacturer";

    Note this doesnt handle duplication,
    so the client has to update existing devices keyed off the ipaddres.

    */
    sweeprScanEvt.addListener('RCTSweeprFoundDevice', this.actions.deviceFound);

    /*
    @objc public enum Sw0eeprErrorStatus: Int {
        case wifiNotAvailable (0)
        case pingTimeout (1)
    }
    */
    sweeprScanEvt.addListener('RCTSweeprFailed', this.actions.devicesScanFailed);

    /* Progress of the ping scan  is between 0 and 1.0. */
    sweeprScanEvt.addListener('RCTSweeprProgress', this.actions.devicesScanProgress);

    /*

    @objc public enum SweeprScanStatus: Int {
        case finished =0
        case cancelled
    }

    you should grey out the start button until this returns
    */
    sweeprScanEvt.addListener('RCTSweeprFinished', this.actions.devicesScanCompleted);
  }

  removeDeviceListeners() {
    sweeprScanEvt.remove();
  }

  // Gets all the services already resolved
  getDevices() {
    return this._devices;
  }
}

export default LocalDevices;
