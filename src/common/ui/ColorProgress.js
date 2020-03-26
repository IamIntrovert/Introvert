// @flow
import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

type Props = {
  style: ?Object,
  maxValue: number,
  value: number,
  backgroundColor: string | Object,
  fillColor: string | Object,
};

export default function ColorProgress({
  style,
  maxValue,
  value,
  backgroundColor,
  fillColor,
}: Props) {
  let fillWidth = 0;
  if (value >= maxValue) {
    fillWidth = 100;
  } else if (value > 0) {
    fillWidth = value * (100 / maxValue);
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.progressCont, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.fill,
            { width: `${fillWidth}%`, backgroundColor: fillColor },
          ]}
        />
      </View>
    </View>
  );
}

ColorProgress.defaultProps = {
  style: null,
  maxValue: 100,
};

const styles = StyleSheet.create({
  container: {
    height: 1,
    width: '100%',
    paddingHorizontal: 16,
  },

  progressCont: {
    height: 1,
    width: '100%',
  },

  fill: {
    height: 1,
  },
});
