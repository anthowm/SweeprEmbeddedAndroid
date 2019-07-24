import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Borders } from '../../Styles/Helpers';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

/**
  * CustomList
  * List component appropriate for listing Services, Devices and similar.
  * Features a label preceeding list items.

  CustomList props
  * data:       Array, each entry will be sent to renderItem method.

  * renderItem: Function returning JSX item.
  *             This function will be called with:
  *             item, navigation

  * label:      String, text to show before list.

  * navigation: navigation object from router.
  */

class CustomList extends Component {
  constructor(props) {
    super(props);
    if (!props.renderItem) {
      console.warn('CustomList missing renderItem prop.');
    }
    if (!props.data) {
      console.warn('CustomList missing data prop.');
    }
    if (!props.label) {
      console.warn('CustomList missing label prop.');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listLabelOuter}>
          <Text style={styles.listLabel}>{this.props.label}</Text>
        </View>
        <FlatList
          data={this.props.data}
          renderItem={({ item }) => {
            return this.props.renderItem({
              item: item,
              navigation: this.props.navigation,
              callback: this.props.onSettingChange
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.spatial.containerBG2
  },
  listLabelOuter: {
    backgroundColor: ThemeColors.spatial.sectionBackground
  },
  listLabel: {
    paddingVertical: 12,
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: ThemeColors.text.primary,
    marginHorizontal: 15
  }
});

export default CustomList;
