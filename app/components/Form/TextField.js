import React, { Component } from 'react';
import { View, TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { textbox } from '../../Styles/Form';
import config from '../../Styles/config';
const { ThemeColors } = config;

class TextField extends Component {
  renderIcon(name, stl, size = 24, callback = null) {
    return name ? <Icon style={[styles.icon, stl]} name={name} size={size} /> : null;
  }

  render() {
    let { styleOuter, style, icon, ...rest } = this.props;
    return (
      <View style={[styles.container, styleOuter]}>
        {this.renderIcon(icon, styles.lhsIcon)}
        {
          // this.renderIcon('cross', styles.rhsIcon, 28, this.props.onClear)
          // Commented out due to complications with clear method.
          // No time for this now /A
        }
        <TextInput style={[textbox.normal, styles.input, style]} {...rest} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.text.primary
  },
  icon: {
    width: 40
  },
  input: {
    flex: 1,
    paddingTop: 5
  }
});

export default TextField;
