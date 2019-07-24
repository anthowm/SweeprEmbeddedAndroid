import { StyleSheet } from 'react-native';

export const ThemeColors = {
  text: {
    primary: '#180F3B',
    featured: '#180F3B',
    secondary: '#333',
    label: '#AAA'
  },
  spatial: {
    themeBackground: '#f5f1ee',
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
    item: '#CAC8D2'
  }
};

export const Status = {
  activity: {
    bullet: '#9649FF',
    circleGradientStart: '#D5B6FF',
    circleGradientEnd: '#9649FF',
    indicator: '#c6a0fb'
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
  main: '#9649ff',
  fullIsGood: {
    quarter: '#E54242',
    half: '#f5a623',
    threeQuarter: '#BBF3DF',
    full: '#69e69d'
  }
};

export const Menu = {
  component: {
    background: '#3A3A3A'
  },
  item: {
    text: '#FFF',
    border: '#F4ECFF',
    icon: '#F4ECFF'
  }
};

export const Authenticate = {
  bg: '#fff'
};

export const Buttons = {
  primary: {
    bg: '#180F3B',
    text: '#F9F9F9'
  },
  primaryDisabled: {
    bg: '#aaa',
    text: '#eee'
  },
  secondary: {
    bg: '#F9F9F9',
    text: '#180F3B'
  }
};

export const Switch = {
  thumb: '#FFF',
  inactive: '#CFCFCF',
  active: '#4CD964'
};

export const Drawer = {
  container: '#3A3A3A'
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
