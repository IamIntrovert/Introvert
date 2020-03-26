// @flow
import React from 'react';
import {
  Animated, Easing, TouchableOpacity, StyleSheet, Text,
} from 'react-native';

import colors from './colors';

type Props = {
  style?: Object,
  animated?: boolean,
  title: string,
  titleStyle?: Object,
  onPress: () => void,
};

type State = {
  animValue: Animated.Value;
};

export default class PulseButton extends React.Component<Props, State> {
  static defaultProps = {
    animated: false,
  };

  state = {
    animValue: new Animated.Value(0),
  };

  componentDidMount() {
    this.runAnimation();
  }

  componentWillUnmount() {
    this.state.animValue.stopAnimation();
  }

  runAnimation() {
    const { animated } = this.props;
    const { animValue } = this.state;

    if (!animated) return;

    Animated.loop(Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.5,
        duration: 150,
        easing: Easing.out(Easing.elastic(2)),
      }),
      Animated.timing(animValue, {
        toValue: -0.5,
        duration: 150,
        easing: Easing.out(Easing.elastic(2)),
      }),
    ])).start();
  }

  render() {
    const { style, title, titleStyle, onPress } = this.props;
    const { animValue } = this.state;

    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
      >
        <Animated.View
          style={[
            styles.animCont,
            { transform: [{ translateX: animValue }] },
          ]}
        >
          <Text style={[styles.titleText, titleStyle]}>
            {title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  animCont: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 24,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
  },

  titleText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'IBMPlexMono',
    fontWeight: 'bold',
    backgroundColor: colors.transparent,
  },
});
