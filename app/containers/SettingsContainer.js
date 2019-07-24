import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

// Reducers and Selectors
import { ProfileSelector } from '../reducers/profile';
import { AccountSettingsSelector } from '../reducers/account';
import { ModesSelector } from '../reducers/modes';
import { ApplicationSelector } from '../reducers/application';

// ActionCreators
import * as accountActionCreators from '../actions/accountActionCreators';
import * as modeActionCreators from '../actions/modeActionCreators';

// Scenes (component, component arg. when creating container)
import Settings from '../scenes/Settings/Settings';

/**
 * Settings
 */

const mapStateToProps = function(state) {
  return {
    skillLevelOptions: ProfileSelector.skillLevelOptions(),
    selectedSkillLevel: ProfileSelector.selectedSkillLevel(state.profile),
    skillLevelSettings: ProfileSelector.skillLevelSettings(state.profile),
    profile: ProfileSelector.exposedUserProfileAsArray(state.profile),
    accountSettings: _.concat(
      AccountSettingsSelector.settings(state.accountSettings),
      ApplicationSelector.settings(state.application),
      ModesSelector.demoModeSetting(state.modes)
    )
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    modeActions: bindActionCreators(modeActionCreators, dispatch)
  };
};

const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

export default SettingsContainer;
