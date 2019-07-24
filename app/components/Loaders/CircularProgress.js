import React, { Component } from 'react';
import { View, Animated, Easing, Platform } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

import config from '../../Styles/config';
const { Status  } = config;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

class CircularProgress extends Component {
  state = {
    rotation: new Animated.Value(0),
  };

  stopAnimation() {
    this.state.rotation.stopAnimation();
    this.setState({ rotation: new Animated.Value(0) });
  }

  startAnimation() {
    Animated.loop(
      Animated.timing(this.state.rotation, {
        useNativeDriver: true,
        duration: 2000,
        toValue: 1,
        easing: Easing.bezier(.8, 0, .2, 1)
      })
    ).start();
  }

  componentDidMount() {
    this.startAnimation();
  }

  render() {
    const circleRadius = 211;
    const bulletWidth = 13;
    const [staticPivotX, staticPivotY] = [0, -7]
    const [dynamicPivotX, dynamicPivotY] = [circleRadius / 2, circleRadius / 2];

    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Svg
          width={circleRadius}
          height={circleRadius}
          viewBox={`-${bulletWidth / 2} -${bulletWidth / 2} ${circleRadius + bulletWidth} ${circleRadius + bulletWidth} `}
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            strokeWidth="4"
            stroke="url(#paint0_linear)"
            d="M105.5 210C163.214 210 210 163.214 210 105.5C210 47.7862 163.214 1 105.5 1C47.7862 1 1 47.7862 1 105.5C1 163.214 47.7862 210 105.5 210Z" />
          <Path
            transform={`translate(${staticPivotX} ${staticPivotY})`}
            fillRule="evenodd"
            clipRule="evenodd"
            fill={Status.activity.bullet}
            d="M105.5 15C109.09 15 112 12.0899 112 8.5C112 4.91015 109.09 2 105.5 2C101.91 2 99 4.91015 99 8.5C99 12.0899 101.91 15 105.5 15Z" />
          <AnimatedG
            style={{
              transform: [
                { translateX: dynamicPivotX },
                { translateY: dynamicPivotY },
                { rotate: this.state.rotation.interpolate({ inputRange: [0, 1], outputRange: ['-165deg', '195deg'] }) },
              ]}}>
            <AnimatedPath
              fill={Status.activity.bullet}
              transform={`translate(-${dynamicPivotX} ${dynamicPivotY - 17})`}
              d="M134.5 18C138.09 18 141 15.0899 141 11.5C141 7.91015 138.09 5 134.5 5C130.91 5 128 7.91015 128 11.5C128 15.0899 130.91 18 134.5 18Z" />
          </AnimatedG>
          <Defs>
            <LinearGradient
              id="paint0_linear"
              gradientUnits="userSpaceOnUse"
              x1="1"
              y1="1"
              x2="1"
              y2="210">
              <Stop offset="0" stopColor={Status.activity.circleGradientStart} />
              <Stop offset="1" stopColor={Status.activity.circleGradientEnd} />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>
    );
  }
}

export default CircularProgress;
