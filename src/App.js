// @flow
import React from 'react';
import { Animated, Easing, Platform, StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import 'react-native-gesture-handler';

// eslint-disable-next-line no-unused-vars
import * as momentDuration from 'moment-duration-format';

import { colors } from './common/ui';
import routes from './config/routing';

if (Platform.OS === 'android') {
  StatusBar.setBackgroundColor(colors.black, true);
  StatusBar.setTranslucent(true);
}

const RootStack = createStackNavigator(routes, {
  navigationOptions: {
    header: null,
    headerPressColorAndroid: colors.rippleColor,
    gesturesEnabled: false,
  },
  headerMode: 'none',
  cardStyle: {
    backgroundColor: 'transparent',
  },

  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
    },

    containerStyle: {
      backgroundColor: 'transparent',
    },

    screenInterpolator: (sceneProps) => {
      const { position, scene } = sceneProps;
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0, 1, 1],
      });

      const scale = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0.85, 1, 1],
      });

      return { opacity, transform: [{ scale }] };
    },
  }),
});

const AppContainer = createAppContainer(RootStack);
export default AppContainer;
