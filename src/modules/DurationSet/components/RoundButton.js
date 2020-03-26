// @flow
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

import { colors } from '../../../common/ui';

type Props = {
  style: ?Object,
  onPress: () => void,
  onPressIn: () => Promise<void>,
};

export default function RoundButton({
  style,
  onPress,
  onPressIn,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      onPressIn={onPressIn}
    >
      <View>
        <Text style={styles.text}>START</Text>
      </View>
    </TouchableOpacity>
  );
}

RoundButton.defaultProps = {
  style: null,
  onPress: () => {},
  onPressIn: () => {},
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.white,
    borderWidth: 2,
    bottom: '12%',
  },

  text: {
    color: colors.white,
    fontSize: 17,
    fontFamily: 'IBMPlexMono',
  },
});
