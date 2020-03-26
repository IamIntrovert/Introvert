// @flow
import React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { colors } from '../../../common/ui';

type Props = {
  style: ?Object,
  selected: boolean,
};

type State = {
  animValue: Animated.Value,
};

export default class PageIndicatorItem extends React.Component<Props, State> {
  static defaultProps = {
    style: null,
  };

  state = {
    animValue: new Animated.Value(0),
  };

  componentDidMount() {
    this.animateItem();
  }

  componentDidUpdate() {
    this.animateItem();
  }

  animateItem() {
    Animated.timing(this.state.animValue, {
      toValue: this.props.selected ? 1 : 0,
      duration: 250,
      easing: Easing.linear,
    }).start();
  }

  render() {
    const { style } = this.props;

    const backgroundColor = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.gray1, colors.white],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.pageIndicator,
          { backgroundColor },
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  pageIndicator: {
    width: '19%',
    height: 1,
    backgroundColor: colors.gray1,
  },
});
