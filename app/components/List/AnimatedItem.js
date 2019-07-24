import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

/** AnimatedItem
  * Adds certain list item appropriate animations to a component (InnerComponent).
  *
  * If 'itemheight' prop is not given, it defaults to 85.
  * If duration prop is not give, animation duration defaults to 180ms.
  */

const AnimatedItem = (InnerComponent) => class extends Component {

  constructor(props) {
    super(props)
    this.collapse = this.collapse.bind(this);
    this.state = {
      itemHeight: new Animated.Value(props.itemHeight),
      duration: props.duration
    };
  }

  static defaultProps = {
    itemHeight: 85,
    duration: 180
  }

  componentWillReceiveProps(nextProps) {
    nextProps.shouldCollapse
      ? this.collapse()
      : null;
  }

  collapse() {
    Animated.timing(
      this.state.itemHeight,
      {
        toValue: 0,
        easing: Easing.in(),
        duration: this.state.duration
      }
    ).start(this.props.onCollapseDone);
  }

  render() {
    const { outerStyle, ...rest } = this.props;
    return (
      <Animated.View style={[outerStyle, { height: this.state.itemHeight }]}>
        <InnerComponent { ...rest } scheduledForDeletion={this.props.scheduledForDeletion} />
      </Animated.View>
    );
  }
}

export default AnimatedItem;
