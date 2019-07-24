import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import config from '../../Styles/config';

const { FontFamily } = config;

class TextLink extends Component {
  render() {
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={this.props.onPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.text, this.props.textStyle]}>
            {this.props.children}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderBottomWidth: 1
  },
  text: {
    fontFamily: FontFamily.light,
    fontSize: 15,
    paddingBottom: 5
  }
});

export default TextLink;
