import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TextInput, ScrollView, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';
import _ from 'lodash';
import config from '../../Styles/config';
const { ThemeColors } = config;

const IMAGES_MAX_WIDTH = Dimensions.get('window').width - 50;
const CUSTOM_STYLES = {};
const DEFAULT_PROPS = {
  htmlStyles: {
    tagsStyles: {
      p: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: 'grey',
        fontSize: 16,
        fontFamily: 'karbon-light'
      }
    }
  },
  imagesMaxWidth: IMAGES_MAX_WIDTH
};

/**
 * FAQDetails
 */

class FAQDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.navigation.state.params };
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>{this.state.title}</Text>
          <HTML {...DEFAULT_PROPS} html={this.state.fullBody} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.spatial.containerBG,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 20,
    fontFamily: 'karbon-regular'
  }
});

export default FAQDetails;
