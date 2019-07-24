import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import config from '../../Styles/config';
const { FontFamily, Status } = config;

class ServerError extends Component {
  static get defaultProps() {
    return {
      message: null
    };
  }

  render() {
    return this.props.message && <Text style={Error.text}>{this.props.message}</Text>;
  }
}

const Error = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: FontFamily.light,
    color: Status.error.text2
  }
});

export default ServerError;
