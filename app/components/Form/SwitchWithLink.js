import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';
import _ from 'lodash';

class SwitchWithLink extends Component {
  render() {
    if(this.props.hidden) return null;

    let stylesheet = this.props.stylesheet;
    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let checkboxStyle = stylesheet.checkbox.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    let errorBlockStyle = stylesheet.errorBlock;

    if(this.props.hasError) {
      formGroupStyle = stylesheet.formGroup.error;
      controlLabelStyle = stylesheet.controlLabel.error;
      checkboxStyle = stylesheet.checkbox.error;
      helpBlockStyle = stylesheet.helpBlock.error;
    }

    let label;
    switch(typeof(this.props.label)) {
      case 'function':
        label = this.props.label();
        break;
      case 'object':
        if(React.isValidElement(this.props.label)) {
          label = this.props.label;
        } else {
          label = null;
          console.warn('Label is not a valid React element.', this.props.label)
        }
        break;
      case 'string':
        label = <Text style={[controlLabelStyle, {fontSize: 12}]}>{this.props.label}</Text>;
        break;
      default:
        console.log('default', this.props.label)
    }

    let help = this.props.help
      ? <Text style={helpBlockStyle}>{this.props.help}</Text>
      : null;

    let error = (this.props.hasError && this.props.error)
      ? <Text accessibilityLiveRegion='polite' style={errorBlockStyle}>{this.props.error}</Text>
      : null;

    return (
      <View style={formGroupStyle}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch'}}>
          <View style={{justifyContent: 'center'}}>{label}</View>
          <View style={{marginLeft: 'auto'}}>
            <Switch accessibilityLabel={this.props.accessibilityLabel}
              ref='input'
              disabled={this.props.disabled}
              trackColor={this.props.trackColor}
              thumbColor={this.props.thumbColor}
              trackColor={this.props.trackColor}
              style={checkboxStyle}
              onValueChange={value => this.props.onChange(value)}
              value={this.props.value} />
        </View>
        </View>
        {help}
        {error}
      </View>
    );
  }
}

export const fn_SwitchWithLink = (locals) => <SwitchWithLink { ...locals } />;
export default SwitchWithLink;
