import React, { Component, Fragment } from 'react';
import { View, TouchableHighlight, Picker, Text, StyleSheet } from 'react-native';
import CustomList from './CustomList';
import _ from 'lodash';
import { Borders } from '../../Styles/Helpers';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

/**
  * Settings Skill Level component
  */

class SettingsSkillLevelPicker extends Component {

  constructor(props) {
    super(props)

    this.onSkillLevelValueChange = this.onSkillLevelValueChange.bind(this);
    this.onSkillLevelOptionsOpen = this.onSkillLevelOptionsOpen.bind(this);
    this.onSkillLevelOptionsClose = this.onSkillLevelOptionsClose.bind(this);

    this.state = { showPicker: false };
  }

  onSkillLevelValueChange(code) {
    this.props.accountActions.setUserSkillLevel(code);
  }

  onSkillLevelOptionsOpen() {
    this.setState({ showPicker: true });
  }

  onSkillLevelOptionsClose(code) {
    this.setState({ showPicker: false });
    this.props.accountActions.updateUserSkillLevel(this.props.selectedSkillLevel);
  }

  render() {
    const renderSkillLevelPickerOptions = (pickerOptions) => {
      return (
        <Fragment>
          <View style={[styles.confirmationContainer, Borders.bottom]}>
            <TouchableHighlight
              underlayColor={'transparent'}
              onPress={() => {this.onSkillLevelOptionsClose()}}>
              <Text style={styles.confirmationText}>Done</Text>
            </TouchableHighlight>
          </View>
          <Picker
            selectedValue={this.props.selectedSkillLevel}
            style={styles.pickerContainer}
            onValueChange={this.onSkillLevelValueChange}>
              {_.map(pickerOptions, (option) => {
                const { code, value } = option;
                const k = `key-${value.replace(/\W/gi, '-').toLowerCase()}`;
                return (<Picker.Item key={k} label={value} value={code} />);
              })}
          </Picker>
        </Fragment>
      )
    }

    const renderPickerItems = (pickerOptions) => {
      return (
        <Fragment>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => {this.onSkillLevelOptionsOpen()}}>
            <CustomList
              data={this.props.data}
              item={this.props.data}
              label={this.props.label}
              renderItem={this.props.renderItem} />
          </TouchableHighlight>
          {this.state.showPicker && renderSkillLevelPickerOptions(pickerOptions)}
        </Fragment>
      )
    }

    return (renderPickerItems(this.props.skillLevelOptions))
  }
}

const styles = StyleSheet.create({
  confirmationContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: ThemeColors.spatial.containerBG
  },
  confirmationText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontFamily: FontFamily.regular,
    fontSize: 14
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: ThemeColors.spatial.containerBG
  }
});

export default SettingsSkillLevelPicker;
