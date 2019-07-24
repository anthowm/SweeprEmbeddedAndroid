import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableHighlight, StyleSheet } from 'react-native';
import CustomList from '../../components/List/CustomList';
import SettingListItem from '../../components/List/SettingListItem';
import SettingsSkillLevelPicker from '../../components/List/SettingsSkillLevelPicker';
import ContentBox from '../../components/ContentBox/ContentBox';

import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

/**
 * Settings scene, will be imported and used as container component
 */

class Settings extends Component {
  constructor(props) {
    super(props);

    this.getCustomListItems = this.getCustomListItems.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
  }

  // Callback is a function that will be invoked on
  // settings change.
  getCustomListItems({ item, callback }) {
    return <SettingListItem key={item.id} item={item} callback={callback} />;
  }

  onSettingChange(newSetting) {
    if (newSetting.id === 'DEMO') this.props.modeActions.setMode(newSetting);
  }

  render() {

    const settings = () => (
      <ScrollView style={styles.content}>
        <CustomList
          data={this.props.profile}
          label={'ACCOUNT DETAILS'}
          renderItem={this.getCustomListItems}
        />
        <CustomList
          data={this.props.accountSettings}
          onSettingChange={this.onSettingChange}
          label={'APPLICATION'}
          renderItem={this.getCustomListItems}
        />
        <SettingsSkillLevelPicker
          data={this.props.skillLevelSettings}
          label={'SKILL LEVEL'}
          renderItem={this.getCustomListItems}
          accountActions={this.props.accountActions}
          selectedSkillLevel={this.props.selectedSkillLevel}
          skillLevelOptions={this.props.skillLevelOptions}
        />
      </ScrollView>
    );

    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.labelWrapper}>
            <Text style={styles.settingsLabel}>My Profile</Text>
          </View>
        </View>
        {settings()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.spatial.containerBG,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16
  },
  settingsLabel: {
    fontFamily: FontFamily.semiBold,
    color: ThemeColors.text.featured,
    fontSize: 24,
    lineHeight: 26
  },
  content: {
    flex: 1,
    backgroundColor: ThemeColors.spatial.containerBG
  }
});

export default Settings;
