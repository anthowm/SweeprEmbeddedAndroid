import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import config from '../../Styles/config';
const { ThemeColors } = config;

/**
  * ContentBox

  * Component elements are laid out as follows:
  * - Outer container: Supplies option to style through props.
  * - Container1: Features shadow.
  * - Arrow: Features shadow and bgColor.
  * - Container2: Features bgColor.

  * This way there's a natural look to the
  * content box speech bubble shadow and the arrow shadow.

  * Props
  * 'shadow': thin / wide. default is 'thin'.
  * 'arrow': Boolean, default is true.
  */

class ContentBox extends Component {
  static get defaultProps() {
    return { shadow: 'thin' };
  }

  render() {
    let shadowStyles = () => {
      switch(this.props.shadow) {
        case 'thin':
          return styles.shadowThin;
        case 'wide':
          return styles.shadowWide;
        default:
          return null;
      }
    };

    return <View style={[styles.bg, shadowStyles(), this.props.style]}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: ThemeColors.spatial.containerBG
  },
  shadowWide: {
    shadowColor: ThemeColors.shade.standard,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    shadowOpacity: 0.2
  },
  shadowThin: {
    shadowColor: ThemeColors.shade.standard,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 6,
    shadowOpacity: 0.16
  }
});

export default ContentBox;
