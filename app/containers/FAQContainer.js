
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Reducers and Selectors
import { FAQSelector } from '../reducers/faqReducer';

// ActionCreators
import * as actionCreators from '../actions/faqActionCreators';

// Scenes (component, component arg. when creating container)
import DeviceFAQ from '../scenes/Devices/DeviceFAQ';

/**
  * FAQ
  */

const mapStateToProps = function(state) {
  return {
    faq: FAQSelector.all(state.faqList)
  };
};

const mapDispatchToProps = function(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
};

const FAQContainer = connect(mapStateToProps, mapDispatchToProps)(DeviceFAQ);

export default FAQContainer;
