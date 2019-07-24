import { StyleSheet } from 'react-native';

export const ThemeColors = {
  text: {
    primary: '#000000',
    featured: '#349CDC',
    secondary: '#333',
    label: '#AAA'
  },
  spatial: {
    themeBackground: '#EFF3F5',
    containerBG: '#fff',
    containerBG2: '#F9F9F9',
    separatorBorder: '#F3F4F4',
    separatorBorder2: '#C5C3CD',
    tertiaryContainer: '#999',
    sectionBackground: '#F2F2F2'
  },
  shade: {
    standard: '#000'
  },
  icon: {
    bottomPanel: '#000'
  },
  border: {
    item: '#F2F2F2'
  }
};

export const Status = {
  activity: {
    bullet: '#029EFF',
    circleGradientStart: '#9EDAFF',
    circleGradientEnd: '#029EFF',
    indicator: '#349CDC'
  },
  error: {
    text: '#777',
    text2: '#E3294B',
    border: '#A84141'
  },
  text: {
    active: '#1B910D',
    inactive: '#AAA'
  },
  icon: {
    positive: '#69e69d',
    poor: '#f5a623',
    negative: '#f13d53',
    neutral: '#dfdfdf'
  }
};

export const Progress = {
  container: '#AAA',
  main: '#349CDC',
  fullIsGood: {
    quarter: '#E54242',
    half: '#f5a623',
    threeQuarter: '#BBF3DF',
    full: '#69e69d'
  }
};

export const Menu = {
  component: {
    background: '#FFF'
  },
  item: {
    text: '#349CDC',
    border: '#FFF',
    icon: '#349CDC'
  }
};

export const Authenticate = {
  bg: '#fff'
};

export const Buttons = {
  primary: {
    bg: '#349CDC',
    text: '#fff'
  },
  primaryDisabled: {
    bg: '#aaa',
    text: '#eee'
  },
  secondary: {
    bg: '#909FA4',
    text: '#FFF'
  }
};

export const Switch = {
  thumb: '#FFF',
  inactive: '#CFCFCF',
  active: '#4CD964'
};

export const Drawer = {
  container: '#FFF'
};

export const FontFamily = {
  light: 'OpenSans-Light',  // fw: 300
  lightItalic: 'OpenSans-LightItalic',  // fw: 300
  regular: 'OpenSans-Regular',  // fw: 400
  italic: 'OpenSans-Italic',  // fw: 400
  semiBold: 'OpenSans-SemiBold',  // fw: 600
  semiBoldItalic: 'OpenSans-SemiBoldItalic',  // fw: 500
  semiBoldItalic: 'OpenSans-SemiBoldItalic',  // fw: 300
  bold: 'OpenSans-Bold',  // fw: 700
  boldItalic: 'OpenSans-BoldItalic',  // fw: 700
  extraBold: 'OpenSans-ExtraBold',  // fw: 800
  extraBoldItalic: 'OpenSans-ExtraBoldItalic'  // fw: 800
};

export const getHeaderBorder = (m) => {
  switch (m.currentMode) {
    case 'DEMO':
      return {
        borderBottomColor: borderColors.demo
      };
    case 'MAINTENANCE':
      return {
        borderBottomColor: borderColors.maintenance
      };
    default:
      return {
        borderBottomColor: borderColors.regular
      };
  }
};
