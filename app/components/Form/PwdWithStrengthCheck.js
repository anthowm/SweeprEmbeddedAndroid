import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableHighlight } from 'react-native';
import zxcvbn from 'zxcvbn';
import _ from 'lodash';
import config from '../../Styles/config';
const { ThemeColors, Progress } = config;

class PwdWithStrengthCheck extends Component {
  constructor(props) {
    super(props);
    this.toggleViewSecureText = this.toggleViewSecureText.bind(this);
    this.state = {
      pwdFieldSecureTextEntry: props.secureTextEntry
    };
  }

  toggleViewSecureText() {
    this.setState({ pwdFieldSecureTextEntry: !this.state.pwdFieldSecureTextEntry });
  }

  render() {
    if (this.props.hidden) return null;

    let stylesheet = this.props.stylesheet;
    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let textboxStyle = stylesheet.textbox.normal;
    let textboxViewStyle = stylesheet.textboxView.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    let errorBlockStyle = stylesheet.errorBlock;

    if (this.props.hasError) {
      formGroupStyle = stylesheet.formGroup.error;
      controlLabelStyle = stylesheet.controlLabel.error;
      textboxStyle = stylesheet.textbox.error;
      textboxViewStyle = stylesheet.textboxView.error;
      helpBlockStyle = stylesheet.helpBlock.error;
    }

    if (this.props.editable === false) {
      textboxStyle = stylesheet.textbox.notEditable;
      textboxViewStyle = stylesheet.textboxView.notEditable;
    }

    let pwdStrength = zxcvbn(this.props.value);
    let label = this.props.label ? <Text style={controlLabelStyle}>{this.props.label}</Text> : null;
    let help = this.props.help ? <Text style={helpBlockStyle}>{this.props.help}</Text> : null;
    let error =
      this.props.hasError && this.props.error ? (
        <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
          {this.props.error}
        </Text>
      ) : null;

    let pwdHelp = !_.isEmpty(pwdStrength.feedback.suggestions) ? (
      <Text accessibilityLiveRegion="polite" style={helpBlockStyle}>
        {_.last(pwdStrength.feedback.suggestions)}.
      </Text>
    ) : null;

    let pwdWarn = !_.isEmpty(pwdStrength.feedback.warning) ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {pwdStrength.feedback.warning}.
      </Text>
    ) : null;

    let barStyle;
    switch (pwdStrength.score) {
      case 1:
        barStyle = styles.quarterFilled;
        break;
      case 2:
        barStyle = styles.halfFilled;
        break;
      case 3:
        barStyle = styles.threeQuarterFilled;
        break;
      case 4:
        barStyle = styles.fullyFilled;
        break;
      default:
        barStyle = {};
        break;
    }

    let toggleViewIcon = this.state.pwdFieldSecureTextEntry ? (
      <TouchableHighlight underlayColor="transparent" onPress={this.toggleViewSecureText}>
        <Image style={styles.pwdIcon} source={require('../../../images/icons/view.png')} />
      </TouchableHighlight>
    ) : (
      <TouchableHighlight underlayColor="transparent" onPress={this.toggleViewSecureText}>
        <Image style={styles.pwdIcon} source={require('../../../images/icons/hide.png')} />
      </TouchableHighlight>
    );

    return (
      <View style={formGroupStyle}>
        {label}
        <View style={[textboxViewStyle, styles.textboxViewLayoutStyle]}>
          <TextInput
            accessibilityLabel={this.props.label}
            ref="input"
            autoCapitalize={this.props.autoCapitalize}
            autoCorrect={this.props.autoCorrect}
            autoFocus={this.props.autoFocus}
            blurOnSubmit={this.props.blurOnSubmit}
            editable={this.props.editable}
            keyboardType={this.props.keyboardType}
            maxLength={this.props.maxLength}
            multiline={this.props.multiline}
            onBlur={this.props.onBlur}
            onEndEditing={this.props.onEndEditing}
            onFocus={this.props.onFocus}
            onLayout={this.props.onLayout}
            onSelectionChange={this.props.onSelectionChange}
            onSubmitEditing={this.props.onSubmitEditing}
            onContentSizeChange={this.props.onContentSizeChange}
            placeholderTextColor={this.props.placeholderTextColor}
            secureTextEntry={this.state.pwdFieldSecureTextEntry}
            selectTextOnFocus={this.props.selectTextOnFocus}
            selectionColor={this.props.selectionColor}
            numberOfLines={this.props.numberOfLines}
            underlineColorAndroid={this.props.underlineColorAndroid}
            clearButtonMode={this.props.clearButtonMode}
            clearTextOnFocus={this.props.clearTextOnFocus}
            enablesReturnKeyAutomatically={this.props.enablesReturnKeyAutomatically}
            keyboardAppearance={this.props.keyboardAppearance}
            onKeyPress={this.props.onKeyPress}
            returnKeyType={this.props.returnKeyType}
            selectionState={this.props.selectionState}
            onChangeText={(value) => this.props.onChange(value)}
            onChange={this.props.onChangeNative}
            placeholder={this.props.placeholder}
            style={[textboxStyle, styles.textboxLayoutStyle]}
            value={this.props.value}
          />
          {toggleViewIcon}
        </View>
        <View>
          <View style={[styles.pwdBar, barStyle]} />
        </View>
        {
          // pwdHelp
        }
        {pwdWarn}
        {help}
        {error}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pwdBar: {
    width: 0,
    height: 5,
    backgroundColor: ThemeColors.spatial.tertiaryContainer
  },
  quarterFilled: {
    width: '25%',
    backgroundColor: Progress.fullIsGood.quarter
  },
  halfFilled: {
    width: '50%',
    backgroundColor: Progress.fullIsGood.half
  },
  threeQuarterFilled: {
    width: '75%',
    backgroundColor: Progress.fullIsGood.threeQuarter
  },
  fullyFilled: {
    width: '100%',
    backgroundColor: Progress.fullIsGood.full
  },
  pwdIcon: {
    width: 20,
    height: 17,
    resizeMode: 'contain'
  },
  textboxViewLayoutStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textboxLayoutStyle: {
    flex: 1
  }
});

// tcomb form library expects a function that returns a react cmp.
export const fn_PwdWithStrengthCheck = (locals) => <PwdWithStrengthCheck {...locals} />;
export default PwdWithStrengthCheck;
