import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ActionCreators

// Component (this case, a router)
import PublicRouter from '../routers/PublicRouter';

/**
 * PublicRouterContainer
 * (Prepared for redux integration when/if CMS would control content)
 */

const mapStateToProps = function(state) {
  return {};
};

const mapDispatchToProps = function(dispatch) {
  return {};
};

const PublicRouterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicRouter);

export default PublicRouterContainer;
