import { StyleSheet } from 'react-native';
import config from '../Styles/config';
const { Status } = config;

/**
 * Styles.js
 * Library for pure function, returning styles that are
 * common, depending on input such as status and element.
 */

const S = {
  // Color.
  // Takes context as an argument, context is a string that could be any of:
  // 'POSITIVE', 'POOR', 'NEGATIVE'
  // Returns a JS object of strings (hexadecimal color).
  color: function(context) {
    switch (context) {
      case 'POSITIVE':
        return { statusIcon: Status.icon.positive };
      case 'POOR':
        return { statusIcon: Status.icon.poor };
      case 'NEGATIVE':
        return { statusIcon: Status.icon.negative };
      default:
        return { statusIcon: Status.icon.neutral };
    }
  }
};

export default S;
