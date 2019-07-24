import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Image, Text, TouchableHighlight } from 'react-native';
import config from '../../Styles/config';
import { Titles, Paragraphs } from '../../Styles/Text';
import _ from 'lodash';
const { ThemeColors, FontFamily, Progress: Progr } = config;

class ResolutionCardItem extends Component {
  static get defaultProps() {
    return {
      data: {},
      meta: {},
      onPrimaryPress: () => {
        console.log('Missing onPrimaryPress handler');
      },
      onSecondaryPress: () => {
        console.log('Missing onSecondaryPress handler');
      }
    };
  }

  render() {
    const { onPrimaryPress, onSecondaryPress, onFinalise } = this.props;
    const {
      media = {},
      title,
      text,
      heading,
      buttonText: { primaryButton: primary = 'Next', secondaryButton: secondary = 'Back' } = {
        primaryButton: 'Next',
        secondaryButton: 'Back'
      }
    } = this.props.data;
    const { index, total } = this.props.meta;
    const primaryPress = index + 1 >= total ? onFinalise : onPrimaryPress;


    const renderHeading = () => {
        if (_.isEmpty(heading) == false) {
          return (
          <View style={Content.container}>
            <Text style={Titles.header}>{heading}</Text>
          </View>
        );
      }
      return null
    }

    const renderMedia = () => {
      let node, asset;
      switch (media.type) {
        case 'image':
          node = (
            <Image
              source={{ uri: media.url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          );
          break;

        default:
          console.warn('Unsupported media type (ResolutionCard.js)');
          return null;
      }
      return <View style={Media.container}>{node}</View>;
    };

    const renderProgressBar = () => {
      const width = `${((index + 1) / total) * 100}%`;
      return (
        <View style={Progress.container}>
          <View style={[Progress.filled, { width }]} />
        </View>
      );
    };

    const renderContent = () => {
      if (_.isEmpty(title) == false) {
        return (
        <ScrollView>
          <View style={Content.container}>
            <Text style={Titles.tertiary}>{title}</Text>
            <Text style={Paragraphs.standard}>{text}</Text>
          </View>
        </ScrollView>
      )} else {
        return (
        <ScrollView>
          <View style={Content.container}>
            <Text style={Paragraphs.standard}>{text}</Text>
          </View>
        </ScrollView>
        )
      }
    };

    const renderFooter = () => (
      <View style={[Footer.container, Footer.shadow]}>
        <TouchableHighlight
          style={Footer.secondaryAction}
          onPress={onSecondaryPress}
          underlayColor="transparent">
          <Text style={Footer.secondaryActionText}>{secondary}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={Footer.primaryAction}
          onPress={primaryPress}
          underlayColor="transparent">
          <Text style={Footer.primaryActionText}>{primary}</Text>
        </TouchableHighlight>
      </View>
    );

    return (
      <View style={CardItem.container}>
        {renderHeading()}
        {renderMedia()}
        {renderProgressBar()}
        {renderContent()}
        {renderFooter()}
      </View>
    );
  }
}

const CardItem = StyleSheet.create({
  container: {
    height: '100%'
  }
});

const Media = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'center'
  }
});

const Progress = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    height: 10
  },
  filled: {
    backgroundColor: Progr.main,
    height: '100%'
  }
});

const Content = StyleSheet.create({
  container: {
    // backgroundColor: '#972def',
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 15
  }
});

const Footer = StyleSheet.create({
  container: {
    // backgroundColor: '#4efa89',
    height: 50,
    flexDirection: 'row'
  },
  primaryAction: {
    // backgroundColor: 'red',
    flex: 1,
    paddingRight: 40,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  secondaryAction: {
    // backgroundColor: 'blue',
    flex: 1,
    paddingLeft: 40,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  primaryActionText: {
    fontSize: 15,
    fontFamily: FontFamily.regular,
    color: ThemeColors.text.primary
  },
  secondaryActionText: {
    fontSize: 15,
    fontFamily: FontFamily.regular,
    color: ThemeColors.text.secondary
  },
  shadow: {
    backgroundColor: ThemeColors.spatial.containerBG,
    shadowColor: ThemeColors.shade.standard,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { height: 4 }
  }
});

export default ResolutionCardItem;
