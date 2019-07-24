import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import config from '../../Styles/config';
const { ThemeColors } = config;

class ToggleNavigationLink extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  static defaultProps = {
    navigate: () => {
      console.warn('ToggleNavigationLink missing navigate prop');
    },
    size: 28,
    name: 'menu',
    color: ThemeColors.text.primary
  };

  onPress() {
    this.props.navigate();
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.onPress}
        style={[styles.container, this.props.style]}
        underlayColor={'transparent'}>
        <Icon
          size={this.props.size}
          color={this.props.color}
          name={this.props.name}
          style={[styles.icon, this.props.imageStyle]}
        />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0
  },
  icon: {
    paddingVertical: 5,
    paddingHorizontal: 12
  }
});

export default ToggleNavigationLink;
