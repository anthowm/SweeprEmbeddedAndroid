import React, { Component } from 'react';
import { View, TouchableOpacity, TouchableHighlight, StyleSheet, Alert } from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
import VoiceInputButton from './VoiceInputButton';

class VoiceInput extends Component {
  constructor(props) {
    super(props);
    this.startListenerTapped = this.startListenerTapped.bind(this);
    this.stopListenerTapped = this.stopListenerTapped.bind(this);
    this.layout = this.layout.bind(this);
    this.alertUserOfCall = this.alertUserOfCall.bind(this);

    this.state = {
      enabled: true,
      alertIsShowing: false,
      buttonLayout: {}
    };
  }

  componentDidMount() {
    this.startListenerTapped();
  }

  componentWillUnmount() {
    this.stopListenerTapped();
  }

  alertUserOfCall(){
    if (!this.alertIsShowing) {
      this.alertIsShowing = true;
      Alert.alert(
        'Phonecall in progress',
        'The voice input is disabled during a call',
        [
          {
            text: 'OK', onPress: () => { this.alertIsShowing = false }
          }
        ]
      );
    }
}

  startListenerTapped() {
    this.callDetector = new CallDetectorManager(event  => {
      const preventEnable = event === 'Connected' || event === 'Incoming' || event === 'Dialing' || event === 'Offhook';
      if (preventEnable) {
        this.setState({ enabled: false })
        this.alertUserOfCall()
      } else {
        this.setState({ enabled: true })
      }
    },
    false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
    () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
    {
      title: 'Phone State Permission',
      message: 'This application supports voice input. Please confirm permission for this application to stop microphone usage during phone calls.'
    }
  )}

  stopListenerTapped() {
    this.callDetector && this.callDetector.dispose();
  }

  layout(e) {
    const { width, height } = e.nativeEvent.layout;
    const max = width > height ? height : width;
    const per = (max / 100) * 20;
    const siz = max - per;

    this.setState({
      buttonLayout: {
        height: siz,
        width: siz,
        borderRadius: siz / 2
      }
    });
  }

  render() {
    const { onPressIn, onPressOut, onLayout, isListening } = this.props;
    const pressIn = this.state.enabled ? onPressIn : null;
    const pressOut = this.state.enabled ? onPressOut : null;

    const touchable = () => {
      return this.state.enabled ? (
        <TouchableHighlight
          underlayColor='transparent'
          onLayout={this.layout}
          style={layout.button}
          onPressIn={pressIn}
          onPressOut={pressOut}>
          <VoiceInputButton isListening={isListening} enabled={this.state.enabled} buttonLayout={this.state.buttonLayout} />
        </TouchableHighlight>
      ) : (
        <View onLayout={this.layout} style={layout.button}>
          <VoiceInputButton isListening={isListening} enabled={this.state.enabled} buttonLayout={this.state.buttonLayout} />
        </View>
      );
    };

    return touchable();
  }
}

const layout = StyleSheet.create({
  button: {
    flex: 3,
    alignItems: 'center', // Center button horizontally
    justifyContent: 'center' // Center button vertically
  }
});

export default VoiceInput;
