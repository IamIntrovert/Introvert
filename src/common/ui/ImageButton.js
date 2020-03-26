// @flow
import React from 'react';
import { Easing, Animated, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  style?: Object,
  imageStyle?: Object,
  source: Object | number,
  onPress: () => void,
  imgTintColor?: string,
  animated?: boolean,
};

type State = {
  rotateAnim: Animated.Value,
};

export default class ImageButton extends React.Component<Props, State> {
  static defaultProps = {
    style: null,
    imageStyle: null,
    imgTintColor: null,
    animated: false,
  };

  state = {
    rotateAnim: new Animated.Value(0),
  };

  onButtonPress = () => {
    Animated.timing(this.state.rotateAnim, {
      toValue: 10,
      duration: 350,
      easing: Easing.out(Easing.linear),
    }).start(() => this.state.rotateAnim.setValue(0));

    if (this.props.onPress) {
      this.props.onPress();
    }
  };

  render() {
    const { animated, style, imageStyle, imgTintColor, source } = this.props;

    const rotate = this.state.rotateAnim.interpolate({
      inputRange: [0, 10],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={this.onButtonPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.Image
          style={[
            styles.image,
            imageStyle,
            { tintColor: imgTintColor },
            animated ? { transform: [{ rotate }] } : null,
          ]}
          source={source}
          tintColor={imgTintColor}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 32,
    height: 32,
  },
});
