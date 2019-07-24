import Config from 'react-native-config';

var ThemeColors, Status, Buttons, Menu, Progress, FontFamily, Drawer, Image;


const env = 'T-Mobile';

switch (env) {
  case 'RockIsland': {
    ({
      ThemeColors,
      Status,
      Buttons,
      Menu,
      Authenticate,
      Progress,
      FontFamily,
      Switch,
      Drawer
    } = require('./RockIsland/config'));
    ({ Image } = require('./RockIsland/assets'));
    break;
  }
  case 'T-Mobile': {
    ({
      ThemeColors,
      Status,
      Buttons,
      Menu,
      Authenticate,
      Progress,
      FontFamily,
      Switch,
      Drawer
    } = require('./T-Mobile/config'));
    ({ Image } = require('./T-Mobile/assets'));
    break;
  }
  default:
    ({
      ThemeColors,
      Status,
      Buttons,
      Menu,
      Authenticate,
      Progress,
      FontFamily,
      Switch,
      Drawer
    } = require('./SWEEPR/config'));
    ({ Image } = require('./SWEEPR/assets'));
}

export default {
  ThemeColors,
  Status,
  Buttons,
  Menu,
  Authenticate,
  Progress,
  FontFamily,
  Switch,
  Drawer,
  Image
};
