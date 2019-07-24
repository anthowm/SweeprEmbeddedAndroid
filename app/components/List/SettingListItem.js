import React, { Component } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import _ from 'lodash';
import config from '../../Styles/config';
import { Borders } from '../../Styles/Helpers';

const { ThemeColors, FontFamily, Switch: Swch } = config;
/**
 * SettingListItem
 */

class SettingListItem extends Component {
  constructor(props) {
    super(props);
    this.renderValue = this.renderValue.bind(this);
    this.onSettingSwitch = this.onSettingSwitch.bind(this);
  }

  onSettingSwitch(switchValue) {
    let newSetting = _.merge({}, this.props.item, { value: switchValue });
    this.props.callback(newSetting);
  }

  renderValue() {
    if (_.isArray(this.props.item.value)) {
      return (
        <View style={[styles.listItemValueOuter]}>
          {this.props.item.value.map((val, i) => {
            const k = `key-${val.replace(/\W/gi, '-').toLowerCase()}`;
            return (
              <Text key={k} style={[styles.listItemText, styles.listItemValue]}>
                {val}
              </Text>
            );
          })}
        </View>
      );
    } else if (_.isNumber(this.props.item.value) || _.isString(this.props.item.value)) {
      return (
        <Text style={[styles.listItemValue, styles.listItemValueOuter, styles.listItemText]}>
          {this.props.item.value}
        </Text>
      );
    } else if (_.isBoolean(this.props.item.value)) {
      return (
        <View style={[styles.listItemValueOuter, styles.alignEnd]}>
          <Switch
            style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
            value={this.props.item.value}
            trackColor={Swch.inactive}
            trackColor={Swch.active}
            thumbColor={Swch.thumb}
            onValueChange={switchValue => this.onSettingSwitch(switchValue)} />
        </View>
      );
    } else {
      console.log('Unknown data (renderValue):', this.props.item.field, this.props.item.value);
      return null;
    }
  }

  render() {
    return (
      <View style={[styles.listItem, Borders.bottom]}>
        <Text style={[styles.listItemLabel, styles.listLabel]}>{this.props.item.label}</Text>
        {this.renderValue()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: ThemeColors.spatial.containerBG
  },
  listLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14
  },
  listItemText: {
    fontFamily: FontFamily.light,
    fontSize: 14
  },
  listItemLabel: {
    flex: 2,
    color: ThemeColors.text.primary
  },
  listItemValue: {
    textAlign: 'right',
    color: ThemeColors.text.secondary
  },
  alignEnd: {
    height: 20,
    alignItems: 'flex-end'
  },
  listItemValueOuter: {
    flex: 3,
  }
});

export default SettingListItem;
