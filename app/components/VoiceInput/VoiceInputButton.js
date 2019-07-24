import React, { Component } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import config from '../../Styles/config';
const { ThemeColors, Buttons, Image: Img } = config;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class VoiceInputButton extends Component {
  constructor() {
    super();
    this.activeVoiceInput = new Animated.Value(0);
  }

  componentDidMount() {
    this.setActiveVoiceInput();
  }

  setActiveVoiceInput() {
    this.activeVoiceInput.setValue(0);
    Animated.timing(this.activeVoiceInput, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
    }).start(() => this.setActiveVoiceInput());
  }

  render() {
    const rotate = this.activeVoiceInput.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const dictation = state => {
      const fill = state ? ThemeColors.text.featured : '#FFFFFF';
      return (
        <Svg width="20" height="36" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path fillRule="evenodd" clipRule="evenodd" d="M10.0017 0.669373C13.2935 0.669373 15.9621 3.45663 15.9621 6.89488V18.447C15.9621 21.8852 13.2935 24.6725 10.0017 24.6725C6.7099 24.6725 4.04136 21.8852 4.04136 18.447V6.89488C4.04136 3.45663 6.7099 0.669373 10.0017 0.669373ZM8.93498 32.6648V28.9742C3.96054 28.4228 -0.00254649 24.0607 1.22768e-06 18.9577V15.7814C1.22768e-06 15.1677 0.476295 14.6702 1.06383 14.6702C1.65137 14.6702 2.12766 15.1677 2.12766 15.7814V18.9583C2.12555 23.1788 5.70007 26.8106 9.99881 26.8106C14.3472 26.8106 17.8723 23.1287 17.8723 18.5868V15.7814C17.8723 15.1677 18.3486 14.6702 18.9362 14.6702C19.5237 14.6702 20 15.1677 20 15.7814V18.5868C20 23.9807 16.086 28.4197 11.0626 28.9745V32.6648H14.5831C15.2881 32.6648 15.8597 33.2618 15.8597 33.9982C15.8597 34.7346 15.2881 35.3316 14.5831 35.3316H5.41454C4.7095 35.3316 4.13795 34.7346 4.13795 33.9982C4.13795 33.2618 4.7095 32.6648 5.41454 32.6648H8.93498ZM6.16901 6.89124C6.16901 4.68201 7.88366 2.89108 9.99879 2.89108C12.1139 2.89108 13.8286 4.68201 13.8286 6.89124V18.4472C13.8286 20.6565 12.1139 22.4474 9.99879 22.4474C7.88366 22.4474 6.16901 20.6565 6.16901 18.4472V6.89124Z" fill={fill}/>
        </Svg>
      );
    };

    renderDefaultVoiceInput = (
      <Image
        source={Img.voiceButton.default}
        style={styles.voiceInput} />);

    renderActiveVoiceInput = (
      <Animated.Image
        source={Img.voiceButton.active}
        style={[styles.voiceInput, { transform: [{ rotate }] }]} />);

    return (
      <View>
        {this.props.isListening ? renderActiveVoiceInput : renderDefaultVoiceInput}
        <View style={styles.dictation}>{dictation(this.props.isListening)}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  voiceInput: {
    width: SCREEN_HEIGHT / 5,
    height: SCREEN_HEIGHT / 5
  },
  dictation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default VoiceInputButton;
